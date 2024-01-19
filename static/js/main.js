const windowWidth = window.innerWidth;

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
  const $menuItems = jQuery("header.desktop nav > .nav-menu > .menu-item");
  const $megaMenuNav = jQuery(".mega-menu nav");

  function hideMegaMenu() {
    $megaMenu.removeClass("open");
  }

  let megaMenuTimeout = null;

  function adjustMegaMenuView($selectedMenuItem) {
    const currentCategory = $megaMenu.data("category").toLowerCase();
    const selectedItemName = $selectedMenuItem.find("> a").text().toLowerCase();

    const $subMenuFirstLevel = $selectedMenuItem.find("> .nav-menu").clone();

    const hasSubmenuNestedLevel =
      $selectedMenuItem.find(".nav-menu .nav-menu").length > 0;

    if (selectedItemName != currentCategory) {
      $megaMenu
        .data("category", selectedItemName)
        .attr("data-category", selectedItemName);
      $megaMenu.find("nav > .nav-menu").remove();
      $megaMenu.find("nav").prepend($subMenuFirstLevel);
      $categoryTitle.text(
        selectedItemName === "shop" ? "Shop by" : selectedItemName
      );

      if (hasSubmenuNestedLevel) {
        $megaMenu.find("nav").addClass("sub-levels");
      } else {
        $megaMenu.find("nav").removeClass("sub-levels");
      }
    }
  }

  let showBestSellers = false;

  if (matchMedia("(pointer:fine)").matches === true) {
    $menuItems
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

    $megaMenuNav.on("mouseenter", "> .nav-menu > .menu-item", function (event) {
      const $item = jQuery(this);
      if ($item.find("> a").text().toLowerCase() === "category") {
        showBestSellers = true;
      } else {
        showBestSellers = false;
      }

      if ($megaMenuNav.hasClass("sub-levels")) {
        $item.siblings().removeClass("active").end().toggleClass("active");
      }
    });

    $megaMenuNav.on("mouseenter", ".menu-item .menu-item a", function (event) {
      const $item = jQuery(this);

      if ($megaMenuNav.hasClass("sub-levels") && showBestSellers) {
        const slugifiedCategory = slugify($item.text());

        jQuery(".best-seller-category")
          .removeClass("show")
          .filter(`[data-category="${slugifiedCategory}"]`)
          .addClass("show");
      }
    });
  } else {
    $menuItems.on("click", function (event) {
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

  function slugify(str) {
    return str
      .toLowerCase()
      .replaceAll("&", "and")
      .replaceAll(" ", "-")
      .replaceAll(",", "-");
  }

  const $productsMiniSlider = jQuery("#products-mini-slider");

  function getMiniSlidesToShow() {
    return window.innerWidth != null ? Math.round(window.innerWidth / 300) : 1;
  }

  if ($productsMiniSlider.length > 0) {
    $productsMiniSlider.slick({
      infinite: true,
      mobileFirst: true,
      slidesToShow: getMiniSlidesToShow(),
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: "50px",
      arrows: false,
      autoplay: true,
      autoplaySpeed: 6000,
    });
  }

  function debounce(callback, delay) {
    let timeoutID = undefined;

    return function (...args) {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => callback(...args), delay);
    };
  }

  const debouncedMiniProductsUpdater = debounce(function (...args) {
    if ($productsMiniSlider.length > 0) {
      $productsMiniSlider.slick(
        "slickSetOption",
        "slidesToShow",
        getMiniSlidesToShow(),
        true
      );
    }
  }, 1000);

  jQuery(window).on("resize", function () {
    debouncedMiniProductsUpdater();
  });
});
