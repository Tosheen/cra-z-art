jQuery(document).ready(function () {
  const $mobileHeaderWrapper = jQuery("header.mobile .nav-wrapper");
  const mobileNavHeaderHeights = ["auto"];

  function adjustNavWrapperHeight() {
    const lastHeight =
      mobileNavHeaderHeights[mobileNavHeaderHeights.length - 1];
    if ($mobileHeaderWrapper) {
      $mobileHeaderWrapper.height(lastHeight);
    }
  }

  function adjustNavWrapperOpacity() {
    if (mobileNavHeaderHeights.length > 1) {
      if ($mobileHeaderWrapper.hasClass("hide") === false) {
        $mobileHeaderWrapper.addClass("hide");
      }
    } else {
      if ($mobileHeaderWrapper.hasClass("hide") === true) {
        $mobileHeaderWrapper.removeClass("hide");
      }
    }
  }

  jQuery(".toggle-navigation").on("click", function (event) {
    jQuery("header.mobile").toggleClass("navigation-open");
    event.preventDefault();
  });

  jQuery("header.mobile").on(
    "click",
    ".nav-menu .menu-item-has-children a",
    function (event) {
      event.stopPropagation();
      event.preventDefault();

      const $navItemAnchor = jQuery(this);
      const $navItem = $navItemAnchor.parent();

      if ($navItem.hasClass("menu-item-has-children")) {
        const $subMenuClone = jQuery("header.mobile > .sub-menu").clone();
        const $subMenuNav = $navItemAnchor.next(".nav-menu").clone();
        $subMenuClone.find(".go-back").text($navItemAnchor.text());
        $subMenuClone.find(".sub-menu-nav").append($subMenuNav);

        jQuery("header.mobile nav").append($subMenuClone);

        setTimeout(() => {
          mobileNavHeaderHeights.push($subMenuClone.height());
          $subMenuClone.addClass("reveal");
          adjustNavWrapperHeight();
        }, 50);

        setTimeout(() => {
          adjustNavWrapperOpacity();
        }, 300);
      }
    }
  );

  jQuery("header.mobile").on("click", ".sub-menu .go-back", function (event) {
    const $subMenu = jQuery(this).parent();
    $subMenu.addClass("obscure");
    mobileNavHeaderHeights.pop();
    adjustNavWrapperOpacity();
    setTimeout(() => {
      $subMenu.remove();
      adjustNavWrapperHeight();
    }, 300);
  });

  const $megaMenu = jQuery(".mega-menu");
  const $categoryTitle = jQuery("h6.category-title");
  const $meniItems = jQuery("header.desktop nav > .nav-menu > .menu-item");
  const $megaMenuNav = jQuery(".mega-menu nav");

  function hideMegaMenu() {
    $megaMenu.removeClass("open");
  }

  let megaMenuTimeout = null;

  function adjustMegaMenuView($selectedMenuItem) {
    const currentCategory = $megaMenu.data("category").toLowerCase();
    const selectedItemName = $selectedMenuItem.find("> a").text().toLowerCase();

    const $subMenuFirstLevel = $selectedMenuItem.find("> .nav-menu").clone();

    if (selectedItemName != currentCategory) {
      $megaMenu
        .data("category", selectedItemName)
        .attr("data-category", selectedItemName);
      $megaMenu.find("nav > .nav-menu").remove();
      $megaMenu.find("nav").prepend($subMenuFirstLevel);
    }
  }

  if (matchMedia("(pointer:fine)").matches === true) {
    $meniItems
      .on("mouseenter", function () {
        clearTimeout(megaMenuTimeout);
        const $item = jQuery(this);
        if ($item.hasClass("menu-item-has-children")) {
          if ($megaMenu.hasClass("open") === false) {
            $megaMenu.addClass("open");
          }

          adjustMegaMenuView($item);
        } else {
          $megaMenu.removeClass("open");
        }
      })
      .on("mouseleave", function () {
        megaMenuTimeout = setTimeout(hideMegaMenu, 500);
      });

    $megaMenu
      .on("mouseenter", function () {
        clearTimeout(megaMenuTimeout);
        if ($megaMenu.hasClass("open") === false) {
          $megaMenu.addClass("open");
        }
      })
      .on("mouseleave", function () {
        megaMenuTimeout = setTimeout(hideMegaMenu, 500);
      });
  } else {
    $meniItems.on("click", function (event) {
      const $item = jQuery(this);

      if ($item.hasClass("menu-item-has-children")) {
        if ($megaMenu.hasClass("open") === false) {
          $megaMenu.addClass("open");
          adjustMegaMenuView($item);
        } else {
          $megaMenu.removeClass("open");
        }
      } else {
        $megaMenu.removeClass("open");
      }

      event.stopPropagation();
      event.preventDefault();
    });

    $megaMenuNav.on("click", "> .nav-menu > .menu-item", function (event) {
      const $item = jQuery(this);
      $item.siblings().removeClass("active").end().toggleClass("active");
    });

    jQuery("html, body").on("click", function (event) {
      if ($megaMenu[0].contains(event.target) === false) {
        $megaMenu.removeClass("open");
      }
    });
  }
});