function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function pluralize_uk(count, words) {
  var cases = [2, 0, 1, 1, 1, 2];
  return words[ (count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)] ];
}

function pluralize_en(count, words) {
  if(count == 1 || count % 10 == 1) {
    return words[0];
  } else {
    return words[1];
  }
}

var StaticController = {
  currentLanguage: "uk",
  defaultLanguage: 'uk',

  log: function(text) {

  },

  loadConfig: function() {
    this.content = content;
    if(window.navigator.language.startsWith('en')) {
      this.currentLanguage = "en-gb";
    }
    if(window.navigator.language.startsWith('uk')) {
      this.currentLanguage = "uk";
    }
    if(window.navigator.language.startsWith('ru')) {
      this.currentLanguage = "ru";
    }

    var lang = getCookie("ze_site_lang");
    if (lang != "") {
      this.setLang(lang);
    } 
  },

  setLang: function(lang) {
    this.currentLanguage = lang;
    setCookie("ze_site_lang", lang, 365);
    jQuery("a.lang-selected").removeClass("lang-selected");
    jQuery("#lang-" + lang).addClass("lang-selected");
    this.update();
  },

  loadTime: function() {
    var obj = this;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("HEAD", "/",true);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4) {
          obj.currentTime = new Date(xmlhttp.getResponseHeader("date"));
          obj.currentJSTime = new Date();
          obj.update();
        }
    }
    xmlhttp.send(null);
  },

  update: function() {
    jQuery("#content-title").html(StaticController.content.languages[StaticController.currentLanguage].title);
    jQuery("#content-text").html(StaticController.content.languages[StaticController.currentLanguage].text);
    jQuery("#site_counter_below_label").html(StaticController.content.languages[StaticController.currentLanguage].label);

    if(StaticController.currentTime) {
      
      var startJsTime   = moment(StaticController.currentJSTime);
      var currentJsTime   = moment(new Date());
      var js_distance  = moment.duration(currentJsTime.diff(startJsTime));
      
      var curTime   = moment(StaticController.currentTime);
      var postTime  = moment(StaticController.content.last_post_date);
      curTime.add(js_distance);

      var distance  = moment.duration(curTime.diff(postTime));

      jQuery("#site-counter-main").html(distance.days());
      switch(StaticController.currentLanguage) {
        case "uk": {

          jQuery("#site-counter-main-label").html(pluralize_uk(distance.days(), ["день", "дні", "днiв"]));
          if(distance.hours() !=0 ) {
            jQuery("#site_counter_hours")
              .html(distance.hours() + " " + pluralize_uk(distance.hours(), ["годину", "години", "годин"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_hours")
              .html("")
              .css("width", "0px")
          }
          if(distance.minutes() !=0 ) {
            jQuery("#site_counter_minutes")
              .html(distance.minutes() + " " + pluralize_uk(distance.minutes(), ["хвилину", "хвилини", "хвилин"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_minutes")
            .html("")
            .css("width", "0px")
          }          
          if(distance.seconds() !=0 ) {
            jQuery("#site_counter_seconds")
              .html(distance.seconds() + " " + pluralize_uk(distance.seconds(), ["секунду", "секунди", "секунд"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_seconds")
            .html("")
            .css("width", "0px")
          }          
          break;
        }
        case "ru": {
          jQuery("#site-counter-main-label").html(pluralize_uk(distance.days(), ["день", "дня", "дней"]));
          if(distance.hours() !=0 ) {
            jQuery("#site_counter_hours").html(distance.hours() + " " + pluralize_uk(distance.hours(), ["час", "часа", "часов"]))
            .css("width", "230px");
          } else {
            jQuery("#site_counter_hours")
            .html("")
            .css("width", "0px")
          }
          if(distance.minutes() !=0 ) {
            jQuery("#site_counter_minutes")
            .html(distance.minutes() + " " + pluralize_uk(distance.minutes(), ["минуту", "минуты", "минут"]))
            .css("width", "230px");
          } else {
            jQuery("#site_counter_minutes")
            .html("")
            .css("width", "0px")
          }
          if(distance.seconds() !=0 ) {
            jQuery("#site_counter_seconds")
            .html(distance.seconds() + " " + pluralize_uk(distance.seconds(), ["секунду", "секунды", "секунд"]))
            .css("width", "230px");
          } else {
            jQuery("#site_counter_seconds")
            .html("")
            .css("width", "0px")
          }
          break;
        }
        case "en-gb": {
          jQuery("#site-counter-main-label").html(pluralize_en(distance.days(), ["day", "days"]));
          
          if(distance.hours() !=0 ) {
            jQuery("#site_counter_hours")
              .html(distance.hours() + " " + pluralize_en(distance.hours(), ["hour", "hours"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_hours")
              .html("")
              .css("width", "0px")
          }

          if(distance.minutes() !=0 ) {
            jQuery("#site_counter_minutes")
              .html(distance.minutes() + " " + pluralize_en(distance.minutes(), ["minute", "minutes"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_minutes")
              .html("")
              .css("width", "0px")
          }              

          if(distance.seconds() !=0 ) {
            jQuery("#site_counter_seconds")
              .html(distance.seconds() + " " + pluralize_en(distance.seconds(), ["second", "seconds"]))
              .css("width", "230px");
          } else {
            jQuery("#site_counter_seconds")
              .html("")
              .css("width", "0px")
          }
          break;
        }
      }
    }
  },

  run: function(){
    window.StaticController = this;
    this.loadConfig();
    this.loadTime();

    setInterval(this.update, 250);
    return this;
  }
}.run();