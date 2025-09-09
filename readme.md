<div align="center">
  <img width="142" height="142" src="https://download.next-hat.com/ressources/images/logo.png" >
  <h2>Nanocl repository</h2>
  <h4>Just apply and enjoy</h4>
  <p align="center">
    <a href="https://discord.gg/WV4Aac8uZg" target="_blank"><b>Discord</b></a> •
    <a href="https://x.com/next_hat" target="_blank"><b>𝕏</b></a>
  </p>
</div>

Officially maintained production ready Statefile

| Name | Description | Documentation | Status |
|---------|-------------|----------------|--------|
| certbot | Issue and renew TLS certificates for a domain using certbot (nginx) and store them as Nanocl TLS secrets. | [root/v0.16/sys/certbot.yml](root/v0.16/sys/certbot.yml) | Stable |
| enable-remote-nanocld | Enable TLS-secured remote access to nanocld and expose it via an ncproxy TCP rule. | [root/v0.16/sys/enable-remote-nanocld.yml](root/v0.16/sys/enable-remote-nanocld.yml) | Stable |
| fail2ban | Containerized Fail2ban with aggressive SSH jail; monitors host logs and enforces iptables bans. | [root/v0.16/sys/fail2ban.yml](root/v0.16/sys/fail2ban.yml) | Stable |
| ipsec | IPsec/L2TP VPN server with PSK and XAuth; exposes UDP 500/4500 and supports configurable DNS. | [root/v0.16/sys/ipsec.yml](root/v0.16/sys/ipsec.yml) | Stable |
| uptime-kuma | Uptime Kuma monitoring service with persistent storage and a proxy rule for your domain. | [root/v0.16/sys/uptime-kuma.yml](root/v0.16/sys/uptime-kuma.yml) | Stable |
| wireguard | WireGuard VPN server; auto-generates peers, uses internal DNS, and exposes UDP 51820. | [root/v0.16/sys/wireguard.yml](root/v0.16/sys/wireguard.yml) | Stable |
