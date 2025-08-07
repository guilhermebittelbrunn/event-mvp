import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard from '@/shared/core/logic/guard';

export interface IpAddressProps {
  value: string;
}

export enum IpVersion {
  IPv4 = 'IPv4',
  IPv6 = 'IPv6',
  UNKNOWN = 'UNKNOWN',
}

export default class IpAddress extends ValueObject<IpAddressProps> {
  private static readonly userFriendlyName = 'IP';

  private static readonly ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  private static readonly ipv6Regex =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})$|^:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)$/;

  private constructor(value: IpAddressProps) {
    super(value);
  }

  get value(): string {
    return this.props.value;
  }

  get friendlyName(): string {
    return IpAddress.userFriendlyName;
  }

  get version(): IpVersion {
    return IpAddress.getIpVersion(this.value);
  }

  get isIPv4(): boolean {
    return this.version === IpVersion.IPv4;
  }

  get isIPv6(): boolean {
    return this.version === IpVersion.IPv6;
  }

  get isLocalhost(): boolean {
    return this.value === '127.0.0.1' || this.value === '::1';
  }

  get isPrivate(): boolean {
    if (this.isIPv4) {
      return this.isPrivateIPv4();
    }
    return this.isPrivateIPv6();
  }

  get isPublic(): boolean {
    return !this.isPrivate && !this.isLocalhost;
  }

  private static isValidIp(ip: string): boolean {
    if (['development', 'test'].includes(process.env.NODE_ENV || '')) {
      return true;
    }

    const trimmedIp = ip.trim();

    if (!trimmedIp) {
      return false;
    }

    const version = IpAddress.getIpVersion(trimmedIp);

    if (version === IpVersion.UNKNOWN) {
      return false;
    }

    return true;
  }

  private static getIpVersion(ip: string): IpVersion {
    const trimmedIp = ip.trim();

    if (this.ipv4Regex.test(trimmedIp)) {
      return IpVersion.IPv4;
    }

    if (this.ipv6Regex.test(trimmedIp)) {
      return IpVersion.IPv6;
    }

    return IpVersion.UNKNOWN;
  }

  private isPrivateIPv4(): boolean {
    const parts = this.value.split('.').map(Number);

    // 10.0.0.0/8
    if (parts[0] === 10) return true;

    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 127.0.0.0/8 (localhost)
    if (parts[0] === 127) return true;

    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;

    return false;
  }

  private isPrivateIPv6(): boolean {
    const ip = this.value.toLowerCase();

    // ::1 (localhost)
    if (ip === '::1') return true;

    // fe80::/10 (link-local)
    if (ip.startsWith('fe80:')) return true;

    // fc00::/7 (unique local)
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true;

    // ::ffff:0:0/96 (IPv4-mapped)
    if (ip.startsWith('::ffff:')) return true;

    return false;
  }

  private static format(ip: string): string {
    return ip.trim().toLowerCase();
  }

  public static getVersion(ip: string): IpVersion {
    return this.getIpVersion(ip.trim());
  }

  public static create(ip: string): IpAddress {
    const guardResult = Guard.againstNullOrUndefined(ip, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const formatted = this.format(ip);

    if (!this.isValidIp(formatted)) {
      throw new GenericErrors.InvalidParam(`${this.userFriendlyName} deve ser um endereço IPv4 ou IPv6 válido`);
    }

    return new IpAddress({ value: formatted });
  }
}
