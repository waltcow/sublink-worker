/**
 * Quantumult X Configuration
 * Base configuration template for QuanX client
 */

export const QUANX_CONFIG = {
  general: {
    excluded_routes:
      "192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,100.64.0.0/10,17.0.0.0/8",
    dns_exclusion_list:
      "*.lan,*.direct,cable.auth.com,*.msftconnecttest.com,*.msftncsi.com,network-test.debian.org,detectportal.firefox.com,resolver1.opendns.com,*.srv.nintendo.net,*.stun.playstation.net,xbox.*.microsoft.com,*.xboxlive.com,stun.*,global.turn.twilio.com,global.stun.twilio.com,app.yinxiang.com,injections.adguard.org,local.adguard.org,cable.auth.com,localhost.*.qq.com,localhost.*.weixin.qq.com,*.logon.battlenet.com.cn,*.logon.battle.net,*.blzstatic.cn,music.163.com,*.music.163.com,*.126.net,musicapi.taihe.com,music.taihe.com,songsearch.kugou.com,trackercdn.kugou.com,*.kuwo.cn,api-jooxtt.sanook.com,api.joox.com,joox.com,y.qq.com,*.y.qq.com,streamoc.music.tc.qq.com,mobileoc.music.tc.qq.com,isure.stream.qqmusic.qq.com,dl.stream.qqmusic.qq.com,aqqmusic.tc.qq.com,amobile.music.tc.qq.com,*.xiami.com,*.music.migu.cn,music.migu.cn,proxy.golang.org,*.mcdn.bilivideo.cn,*.cmpassport.com,id6.me,open.e.189.cn,opencloud.wostore.cn,id.mail.wo.cn,mdn.open.wo.cn,hmrz.wo.cn,nishub1.10010.com,enrichgw.10010.com,*.wosms.cn,*.jegotrip.com.cn,*.icitymobile.mobi,*.pingan.com.cn,*.cmbchina.com,*.10099.com.cn,*.microdone.cn,pool.ntp.org,*.pool.ntp.org,ntp.*.com,time.*.com,ntp?.*.com,time?.*.com,time.*.gov,time.*.edu.cn,*.ntp.org.cn,PDC._msDCS.*.*,DC._msDCS.*.*,GC._msDCS.*.*",
    network_check_url: "http://wifi.vivo.com.cn/generate_204",
    server_check_url: "http://cp.cloudflare.com/generate_204",
    geo_location_checker:
      "http://ip-api.com/json/?lang=zh-CN,https://testingcf.jsdelivr.net/gh/KOP-XIAO/QuantumultX@master/Scripts/IP_API.js",
  },
  dns: [
    "prefer-doh3",
    "server = 119.29.29.29",
    "server = 223.5.5.5",
    "server = 223.6.6.6",
    "doh-server = https://223.5.5.5/dns-query,https://223.6.6.6/dns-query",
  ],
  policy: [
    "static=AdBlock,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png",
    "static=Outside,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    "static=Mainland,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Domestic.png",
    "static=Apple,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png",
    "static=Google,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png",
    "static=Github,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/GitHub.png",
    "static=AI Suite,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AI.png",
    "static=China Media,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/DomesticMedia.png",
    "static=Asian Media,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/HKMTMedia.png",
    "static=Global Media,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ForeignMedia.png",
    "static=Netflix,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png",
    "static=Disney+,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney.png",
    "static=YouTube,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
    "static=Max,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/HBO_Max.png",
    "static=Spotify,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png",
    "static=Telegram,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram_X.png",
    "static=Crypto,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png",
    "static=Discord,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Discord.png",
    "static=Microsoft,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png",
    "static=PayPal,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/PayPal.png",
    "static=Speedtest,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Speedtest.png",
    "static=Others,img-url=https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
  ],
  server_local: [],
  server_remote: [],
  filter_remote: [],
  filter_local: [],
  rewrite_remote: [
    "https://testingcf.jsdelivr.net/gh/app2smile/Rules@master/module/bilibili-qx.conf,tag=Bilibili Adblock (app2smile),update-interval=43200,enabled=true",
    "https://testingcf.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/script/zheye/zheye.snippet,tag=Zhihu Zheye (blackmatrix7),update-interval=43200,enabled=true",
    "https://testingcf.jsdelivr.net/gh/NobyDa/Script@master/QuantumultX/TestFlightDownload.conf,tag=TFDownload (NobyDa),update-interval=43200,enabled=true",
    "https://testingcf.jsdelivr.net/gh/GeQ1an/Rules@master/QuantumultX/Rewrite/Rewrite.list,tag=Rewrite (Stick Rules),update-interval=43200,enabled=true",
  ],
  rewrite_local: [
    "^https?://api\\.m\\.jd\\.com/client\\.action\\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/zwf234/rules/master/js/jd_price.js",
    "^https?://ios\\.prod\\.ftl\\.netflix\\.com/iosui/user/.+path=%5B%22videos%22%2C%\\d+%22%2C%22summary%22%5D url script-request-header https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js",
    "^https?://ios\\.prod\\.ftl\\.netflix\\.com/iosui/user/.+path=%5B%22videos%22%2C%\\d+%22%2C%22summary%22%5D url script-response-body https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js",
    "^https?://m?api\\.weibo\\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\\!/photos/pic_recommend_status) url script-response-body https://testingcf.jsdelivr.net/gh/yichahucha/surge@master/wb_ad.js",
    "^https?://(sdk|wb)app\\.uve\\.weibo\\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body https://testingcf.jsdelivr.net/gh/yichahucha/surge@master/wb_launch.js",
  ],
  mitm: {
    passphrase: "Dler",
    p12: "MIIDGgIBAzCCAuAGCSqGSIb3DQEHAaCCAtEEggLNMIICyTCCAb8GCSqGSIb3DQEHBqCCAbAwggGsAgEAMIIBpQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQYwDgQI5e4W8st2yMMCAggAgIIBeBDhcB5oCpEtPyamF2QSSZMoKnIQ9idB7/spS4BgYMq/zDT8c7SDSKM746+4D98feqkJmAYFUWlXtXOHwSR8QlFad9dTYw4SulHDpDAVr/+da6iCX+LeQuducormCI6xVcmpfZ8qvHWzpfHy5mrKxkuyj5OHlehvYOedDZ9P9s9ME2qZFsffKC4kk398QPjoBMLCb73m7QcFdzdus7NuVAd/kYZRww7ODcXcb5a45Yv4NeRwRjnVT8eCgjGXjJXQgJPAtyAWPLW+o1uS132Qdkmg+8EjwuxL/lOu3rLKh0gWWUFHcxv2rg4OcezyoZuv70zs3A8Ju3wmQ6oZuakeRuRyKu6+9BtgOqxnoBwvTMCI4saY8E318DWZjBOzg9N2vPOhKDeoh8ES9TAbRlcp5Bnp5TWrPhae+XeHlHde5KCr3kjB15/DAhrlh7+ht18I/p1shnRKAd1tH6p62to51j9mSHNxOFFCbBPiFqBSnPmuV2SSOOYHcjUwggECBgkqhkiG9w0BBwGggfQEgfEwge4wgesGCyqGSIb3DQEMCgECoIG0MIGxMBwGCiqGSIb3DQEMAQMwDgQI/FfHqSBxFUoCAggABIGQIJa8eopsdqunR4ZwxWt/ThhdkRw2LFHTbgg5jWdAUQfK2b+I6+Wk9Dimdb2xGzAaYcAVt3ArbfuDTjDUTI4m3pzXBe/edyeXagr6i6DgM9TluB4OsG6hC/MFtF3rvqnCT3DGf5b48hSj0Y5OfJy+iFXmasxtwVIf4pFFylXOOJeJdQry1NgImb0nZwsS8NJAMSUwIwYJKoZIhvcNAQkVMRYEFHijHPCciGG5pbv+qBYZvjpHBIFnMDEwITAJBgUrDgMCGgUABBSxzZGBSpKB8R5FQ6wdiWxFka+xcgQIxB+kS2hfUpkCAggA",
    hostname:
      "api.m.jd.com,ios.prod.ftl.netflix.com,api.weibo.cn,mapi.weibo.com,*.uve.weibo.com",
  },
};
