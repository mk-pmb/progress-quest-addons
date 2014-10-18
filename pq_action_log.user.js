/* -*- coding: UTF-8, tab-width: 2 -*- */
// ProgressQuest Action Log Addon
// Copyright (C) 2014  M. Krause <http://www.pimpmybyte.de/>
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// ==UserScript==
// @name        ProgressQuest Action Log
// @namespace   greasemonkey.web-enhance.pimpmybyte.de
// @include     http://www.progressquest.com/play/main.html
// @include     http://www.progressquest.com/play/main.html#*
// @grant       none
// @version     1
// ==/UserScript==
/*jslint indent: 2, maxlen: 80, browser: true */

//javascript:
(function () {
  'use strict';
  var jq = window.jQuery, mainWin = jq('#main')[0],
    logPane = jq('#actionLog')[0];

  if (!logPane) {
    logPane = jq('<div class="vbox" id="actionLog">')[0];
    jq(mainWin).find('.hbox').first().append(logPane);
    logPane.msgLog = [];
    logPane.prevMsg = '';
    logPane.chkMsgNow = function () {
      var prevMsg = logPane.prevMsg, curMsg = jq('#Kill').text(), msgIdx;
      if (curMsg === prevMsg) { return; }
      logPane.prevMsg = curMsg;
      msgIdx = logPane.msgLog.length;
      curMsg = { date: new Date(), msg: curMsg };
      logPane.msgLog[msgIdx] = curMsg;
      logPane.addMsg(curMsg.date, curMsg.msg, msgIdx);
    };
    setInterval(logPane.chkMsgNow, 50);
    // window.actionLogPane = logPane;
  }

  jq(logPane).empty().html([
    '<label style="float: right;"> auto-scroll</label>',
    '<span class="label head">Action Log</span>',
    '<div class="scroll listbox"></div>',
    ''].join('\n'));
  logPane.autoScroll = function () {
    if (logPane.ckbAutoScroll.checked) {
      logPane.lst.scrollTop(jq(logPane.logDest).height());
    }
  };
  logPane.ckbAutoScroll = jq('<input type="checkbox">').prependTo(jq(logPane
    ).find('label').first())[0];
  logPane.lst = jq(logPane).find('.listbox');
  logPane.logDest = jq('<div class="events"></div>').css({
    margin: '0.5em 0.25em',
  }).appendTo(logPane.lst)[0];
  jq(logPane).width(logPane.lst.width());
  jq(mainWin).css({ width: 'auto' });
  logPane.lst.height(jq(logPane).siblings().first().height()).css({
    position: 'absolute',
  });

  logPane.msgPrefixRgx = /^(([a-z]{4,}\s){1,5})(\S[\S\s]*)$/i;
  logPane.addMsg = function (when, msg) {
    var pfx = logPane.msgPrefixRgx.exec(msg), dest = logPane.logDest, logLn;
    if (pfx) {
      msg = pfx[3].replace(/\.{3}\s*$/, '');
      pfx = pfx[1].replace(/\s+$/, '');
    } else {
      pfx = '??';
    }
    when = when.toTimeString().split(/\s/)[0] + ', ' + when.toDateString();
    // console.log([when, pfx, msg]);
    logLn = dest.lastChild;
    if (logLn) {
      if (jq(logLn.firstChild).text() !== pfx) { logLn = null; }
    }
    if (logLn) {
      logLn.innerHTML += ', ';
    } else {
      logLn = jq('<p><b></b> </p>').appendTo(dest)[0];
      jq(logLn.firstChild).text(pfx);
    }
    jq('<span></span>').text(msg).appendTo(logLn)[0].title = when;
    logPane.autoScroll();
  };

  jq.each(logPane.msgLog, function (idx, msg) {
    logPane.addMsg(msg.date, msg.msg, idx);
  });

  logPane.ckbAutoScroll.onchange = logPane.autoScroll;
  logPane.ckbAutoScroll.checked = true;
















}());