# express-login-server

The server for cookie-based login verification.

This repo was forked from [express-ts-boilerplate](https://github.com/redshoga/express-ts-boilerplate).

## サブドメインでホスティングされているSPAでHttpOnlyなCookieベースでログインできるかチェック

以下を`/etc/hosts`に

```
127.0.0.1 example.com
127.0.0.1 sub.example.com
```

以下でサーバを起動して

```
yarn dev
```

sub.example.comにアクセスする
