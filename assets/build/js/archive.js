var StaticController = {
  getLang: function() { return "uk"; }
};

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

var TranslationsController = {
  translations: {},
  loadTranslations: function (data) {
    this.translations = data.translations;
  },

  applyTranslations: function (lang) {
    var key = 0;
    var _that = this;
    for (tr in Object.keys(this.translations)) {
      key = Object.keys(_that.translations)[tr];
      $("#" + key).html(_that.translations[key][StaticController.getLang()]).attr("lang_updated", true)
    }
  },

  receiveMessage: function(message) {
    TranslationsController.loadTranslations(message.data);
    TranslationsController.applyTranslations();
  },  

  run: function() {
    //window.addEventListener("message", this.receiveMessage, false);
    return this;
  }
}.run();

var MainPageArchiveController = {
  articles: {},
  loadArchive: function (data) {
    this.articles = data.main_page_archive;
  },

  applyArchive: function (lang) {
    jQuery("#main_mage_archive_list li").remove();
    for(tr in Object.keys(this.articles)) {
      jQuery("#main_mage_archive_list").append("<li>"+this.articles[Object.keys(this.articles)[tr]].languages[StaticController.getLang()].text+ " (" + moment(this.articles[Object.keys(this.articles)[tr]].last_post_date).format("DD.MM.YYYY HH:mm")+ ")</li>");
    }
  },

  receiveMessage: function(message) {
    MainPageArchiveController.loadArchive(message.data);
    MainPageArchiveController.applyArchive();
  },
  run: function() {
    //window.addEventListener("message", this.receiveMessage, false);
    return this;
  }
}.run();


StaticController = {
  currentLanguage: "uk",
  defaultLanguage: 'uk',

  loadConfig: function() {
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

  getLang: function() {
    return this.currentLanguage;
  },

  setLang: function(lang) {
    this.currentLanguage = lang;
    setCookie("ze_site_lang", lang, 365);

    jQuery("a.lang-selected").removeClass("lang-selected");
    jQuery("#lang-" + lang).addClass("lang-selected");
    
    if(window.TranslationsController) {
      window.TranslationsController.applyTranslations();
    }

    if(window.ViolationsCounterController) {
      window.ViolationsCounterController.applyViolationsCounters();
    }

    if(window.MainPageArchiveController) {
      window.MainPageArchiveController.applyArchive();
    }
  },

  run: function(){
    if(window.TranslationsController) {
      window.TranslationsController.receiveMessage({"data":site_archive});
    }

    if(window.ViolationsCounterController) {
      window.ViolationsCounterController.receiveMessage({"data":site_archive});
    }

    if(window.MainPageArchiveController) {
      window.MainPageArchiveController.receiveMessage({"data":site_archive});
    }    

    window.StaticController = this;
    this.loadConfig();

    return this;
  }
}.run();