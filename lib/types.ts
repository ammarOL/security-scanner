export type ScanResult = {
  ports: number[];
  subdomains: string[];
  sqli: string;
  xss: string;
};
