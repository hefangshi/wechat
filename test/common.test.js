var should = require('should');
var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var path = require('path');
var config = require('./config');
var API = require('../').API;

var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';
var imageId = 'XDZxzuRWBPqI4R9n_nNR5uRVZVQCSneMoELyWKflwM2qF9K38vnVFzgaD97uCTUu';
var voiceId = '9R5BhAum7AEaGhwku0WhgvtO4C_7Xs78NoiRvm6v7IyoTljE4HH5o8E_UfnPrL0p';
var thumbId = 'BHxGDVy7WY6BCOcv3AwbywUE630Vw0tAV_V8bzBaCZid4Km5fwXrVOso3X0zas4n';
var movieId = 'b4F8SfaZZQwalDxwPjd923ACV5IUeYvZ9-dYKf5ytXrS-IImXEkl2U8Fl5EH-jCF';

describe('common.js', function () {
  describe('getAccessToken', function () {
    it('should ok', function (done) {
      var api = new API(config.appid, config.appsecret);
      api.getAccessToken(function (err, token) {
        should.not.exist(err);
        expect(token).to.only.have.keys('accessToken', 'expireTime');
        done();
      });
    });

    it('should not ok', function (done) {
      var api = new API('appid', 'secret');
      api.getAccessToken(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('mock urllib err', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var err = new Error('Urllib Error');
          err.name = 'UrllibError';
          callback(err);
        });
      });

      after(function () {
        muk.restore();
      });

      it('should get mock error', function (done) {
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          should.exist(err);
          err.name.should.be.equal('WeChatAPIUrllibError');
          err.message.should.be.equal('Urllib Error');
          done();
        });
      });
    });

    describe('mock token', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          process.nextTick(function () {
            callback(null, {"access_token": "ACCESS_TOKEN","expires_in": 7200});
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          should.not.exist(err);
          token.should.have.property('accessToken', 'ACCESS_TOKEN');
          // token.should.have.property('expireTime', 7200);
          done();
        });
      });
    });
  });

  describe('isAccessTokenValid', function () {
    var api = new API('appid', 'secret', {});
    it('should invalid', function () {
      api.token.isValid().should.be.equal(false);
    });

    it('should valid', function () {
      api.token.accessToken = 'token';
      api.token.expireTime = new Date().getTime() + 7200 * 1000;
      api.token.isValid().should.be.equal(true);
    });
  });

  describe('invalid token', function () {
    var api = new API('appid', 'secret');
    var isAccessTokenValid = api.isAccessTokenValid;
    before(function () {
      api.isAccessTokenValid = function () {
        return true;
      };
    });

    after(function () {
      api.isAccessTokenValid = isAccessTokenValid;
    });

    it('createMenu should not ok', function (done) {
      api.createMenu('{}', function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getMenu should not ok', function (done) {
      api.getMenu(function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('removeMenu should not ok', function (done) {
      api.removeMenu(function (err, token) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createTmpQRCode should not ok', function (done) {
      api.createTmpQRCode(123, 1800, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createLimitQRCode should not ok', function (done) {
      api.createLimitQRCode(123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('showQRCodeURL should not ok', function () {
      api.showQRCodeURL('ticket').should.be.equal('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
    });

    it('getGroups should not ok', function (done) {
      api.getGroups(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('createGroup should not ok', function (done) {
      api.createGroup('new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('updateGroup should not ok', function (done) {
      api.updateGroup(123, 'new group', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('moveUserToGroup should not ok', function (done) {
      api.moveUserToGroup('openid', 123, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getUser should not ok', function (done) {
      api.getUser('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getFollowers should not ok', function (done) {
      api.getFollowers(function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('getFollowers with nextOpenId should not ok', function (done) {
      api.getFollowers('openid', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendText should not ok', function (done) {
      api.sendText('openid', 'Hellow World', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendImage should not ok', function (done) {
      api.sendImage('openid', 'imageId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendVoice should not ok', function (done) {
      api.sendVoice('openid', 'imageId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendVideo should not ok', function (done) {
      api.sendVideo('openid', 'mediaId', 'thumbMediaId', function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendMusic should not ok', function (done) {
      var music = {
        "title":"MUSIC_TITLE", // 可选
        "description":"MUSIC_DESCRIPTION", // 可选
        "musicurl":"MUSIC_URL",
        "hqmusicurl":"HQ_MUSIC_URL",
        "thumb_media_id":"THUMB_MEDIA_ID"
      };

      api.sendMusic('openid', music, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('sendNews should not ok', function (done) {
      var articles = [
        {
          "title":"Happy Day",
          "description":"Is Really A Happy Day",
          "url":"URL",
          "picurl":"PIC_URL"
        }
      ];

      api.sendNews('openid', articles, function (err, data, res) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('deliverNotify should not ok', function (done) {
      api.deliverNotify('{}', function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    it('orderQuery should not ok', function (done) {
      api.orderQuery('{}', function (err, menu) {
        should.exist(err);
        err.name.should.be.equal('WeChatAPIError');
        err.message.should.be.equal('invalid appid');
        done();
      });
    });

    describe('upload media', function () {
      ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
        before(function () {
          muk(urllib, 'request', function (url, args, callback) {
            var resp = {
              "type":"image",
              "media_id":"usr5xL_gcxapoRjwH3bQZw_zKvcXL-DU4tRJtLtrtN71-3bXL52p3xX63ebp7tqA",
              "created_at":1383233542
            };
            process.nextTick(function () {
              callback(null, resp);
            });
          });
        });

        after(function () {
          muk.restore();
        });
        it('upload' + method + ' should ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/image.jpg'), function (err, data, res) {
            should.not.exist(err);
            data.should.have.property('type', 'image');
            data.should.have.property('media_id');
            data.should.have.property('created_at');
            done();
          });
        });

        it('upload' + method + ' should not ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
            should.exist(err);
            err.should.have.property('name', 'Error');
            err.should.have.property('code', 'ENOENT');
            done();
          });
        });
      });
    });

    describe('get media with buffer', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var buffer = new Buffer('Hello world!');
          var res =  {
            headers: {
              'content-type': 'image/jpeg'
            }
          };
          process.nextTick(function () {
            callback(null, buffer, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('getMedia with buffer', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.not.exist(err);
          data.toString().should.be.equal('Hello world!');
          done();
        });
      });
    });

    describe('get media with json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('getMedia with json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'WeChatAPIError');
          err.should.have.property('message', 'invalid media_id');
          done();
        });
      });
    });

    describe('get media with err json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = '{"errcode":40007, "errmsg":"invalid media_id"';
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('getMedia with err json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'SyntaxError');
          done();
        });
      });
    });
  });

  describe('valid appid', function () {
    var api = new API(config.appid, config.appsecret);
    before(function (done) {
      api.getAccessToken(done);
    });

    it('createMenu should ok', function (done) {
      var menu = JSON.stringify(require('./fixture/menu.json'));
      api.createMenu(menu, function (err, result) {
        expect(err).not.to.be.ok();
        expect(result).to.have.property('errcode', 0);
        expect(result).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('getMenu should ok', function (done) {
      api.getMenu(function (err, menu) {
        expect(err).not.to.be.ok();
        expect(menu).to.have.property('menu');
        expect(menu.menu).to.have.property('button');
        expect(menu.menu.button).to.have.length(3);
        done();
      });
    });

    it('removeMenu should ok', function (done) {
      api.removeMenu(function (err, result) {
        expect(err).not.to.be.ok();
        expect(result).to.have.property('errcode', 0);
        expect(result).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('createTmpQRCode should ok', function (done) {
      api.createTmpQRCode(123, 1800, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('ticket');
        expect(data).to.have.property('expire_seconds');
        done();
      });
    });

    it('createLimitQRCode should ok', function (done) {
      api.createLimitQRCode(123, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('ticket');
        done();
      });
    });

    it('showQRCodeURL should ok', function () {
      api.showQRCodeURL('ticket').should.be.equal('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=ticket');
    });

    it('getGroups should ok', function (done) {
      api.getGroups(function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('groups');
        expect(data.groups).to.be.an('array');
        done();
      });
    });

    it('getWhichGroup should ok', function (done) {
      api.getWhichGroup(puling, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('groupid');
        done();
      });
    });

    it('createGroup should ok', function (done) {
      api.createGroup('new group', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('group');
        expect(data.group).to.have.property('id');
        expect(data.group).to.have.property('name');
        done();
      });
    });

    it('updateGroup should ok', function (done) {
      api.updateGroup(101, 'renamed group', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('moveUserToGroup should ok', function (done) {
      api.moveUserToGroup(puling, 102, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('getUser should ok', function (done) {
      api.getUser(puling, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.only.have.keys('subscribe', 'openid', 'nickname',
          'sex', 'language', 'city', 'province', 'country', 'headimgurl',
          'subscribe_time', 'remark');
        done();
      });
    });

    it('getFollowers should ok', function (done) {
      api.getFollowers(function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.only.have.keys('total', 'count', 'data', 'next_openid');
        done();
      });
    });

    it('getFollowers with nextOpenId should ok', function (done) {
      api.getFollowers(puling, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.key('next_openid');
        done();
      });
    });

    it('sendText should ok', function (done) {
      api.sendText(puling, 'Hellow World', function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('sendImage should ok', function (done) {
      api.sendImage(puling, imageId, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('sendVoice should ok', function (done) {
      api.sendVoice(puling, voiceId, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('sendVideo should ok', function (done) {
      api.sendVideo(puling, movieId, thumbId, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('sendMusic should ok', function (done) {
      var music = {
        "title":"MUSIC_TITLE", // 可选
        "description":"MUSIC_DESCRIPTION", // 可选
        "musicurl":"MUSIC_URL",
        "hqmusicurl":"HQ_MUSIC_URL",
        "thumb_media_id": thumbId
      };

      api.sendMusic(puling, music, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    it('sendNews should ok', function (done) {
      var articles = [
        {
          "title":"Happy Day",
          "description":"Is Really A Happy Day",
          "url":"URL",
          "picurl": "PIC_URL"
        }
      ];

      api.sendNews(puling, articles, function (err, data, res) {
        expect(err).not.to.be.ok();
        expect(data).to.have.property('errcode', 0);
        expect(data).to.have.property('errmsg', 'ok');
        done();
      });
    });

    describe('upload media', function () {
      var fixture = {
        'Image': path.join(__dirname, './fixture/image.jpg'),
        'Voice': path.join(__dirname, './fixture/test.mp3'),
        'Video': path.join(__dirname, './fixture/movie.mp4'),
        'Thumb': path.join(__dirname, './fixture/pic.jpg')
      };
      ['Image', 'Voice', 'Video', 'Thumb'].forEach(function (method) {
        it('upload' + method + ' should ok', function (done) {
          // 上传文件比较慢
          this.timeout(60000);
          api['upload' + method](fixture[method], function (err, data, res) {
            should.not.exist(err);
            data.should.have.property('type', method.toLowerCase());
            if (method === 'Thumb') {
              data.should.have.property('thumb_media_id');
            } else {
              data.should.have.property('media_id');
            }
            data.should.have.property('created_at');
            done();
          });
        });

        it('upload' + method + ' should not ok', function (done) {
          api['upload' + method](path.join(__dirname, './fixture/inexist.jpg'), function (err, data, res) {
            should.exist(err);
            err.should.have.property('name', 'Error');
            err.should.have.property('code', 'ENOENT');
            done();
          });
        });
      });
    });

    describe('get media with buffer', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var buffer = new Buffer('Hello world!');
          var res =  {
            headers: {
              'content-type': 'image/jpeg'
            }
          };
          process.nextTick(function () {
            callback(null, buffer, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });

      it('getMedia with buffer', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.not.exist(err);
          data.toString().should.be.equal('Hello world!');
          done();
        });
      });
    });

    describe('get media with json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = JSON.stringify({"errcode":40007, "errmsg":"invalid media_id"});
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('getMedia with json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'WeChatAPIError');
          err.should.have.property('message', 'invalid media_id');
          done();
        });
      });
    });

    describe('get media with err json', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = '{"errcode":40007, "errmsg":"invalid media_id"';
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('getMedia with err json', function (done) {
        api.getMedia('media_id', function (err, data, res) {
          should.exist(err);
          err.should.have.property('name', 'SyntaxError');
          done();
        });
      });
    });

    describe('getRecords mock', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var data = {"recordlist": []};
          var res =  {
            headers: {
              'content-type': 'application/json'
            }
          };
          process.nextTick(function () {
            callback(null, data, res);
          });
        });
      });

      after(function () {
        muk.restore();
      });
      it('getRecords should ok', function (done) {
        var condition = {
          "starttime" : 123456789,
          "endtime" : 987654321,
          // "openid" : "OPENID",
          "pagesize" : 10,
          "pageindex" : 1,
        };

        api.getRecords(condition, function (err, data, res) {
          expect(err).not.to.be.ok();
          expect(data).to.have.property('recordlist');
          done();
        });
      });
    });
  });
});
