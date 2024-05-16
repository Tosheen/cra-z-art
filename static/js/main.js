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

  let openMenuTimeout = null;

  if (matchMedia("(pointer:fine)").matches === true) {
    $menuItems
      .on("mouseenter", function () {
        clearTimeout(megaMenuTimeout);
        const $item = jQuery(this);
        if ($item.hasClass("menu-item-has-children")) {
          if ($megaMenu.hasClass("open") === false) {
            openMenuTimeout = setTimeout(() => {
              $megaMenu.addClass("open");
            }, 500);
          }

          adjustMegaMenuView($item);
        } else {
          $megaMenu.removeClass("open");
        }
      })
      .on("mouseleave", function () {
        clearTimeout(openMenuTimeout);
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
        jQuery(".best-seller-category").addClass("show");
      } else {
        jQuery(".best-seller-category").removeClass("show");
      }

      if ($megaMenuNav.hasClass("sub-levels")) {
        $item.siblings().removeClass("active").end().toggleClass("active");
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

    $megaMenuNav.on("click", "> .nav-menu > .menu-item > a", function (event) {
      event.preventDefault();
    });

    jQuery("html, body").on("click", function (event) {
      if ($megaMenu[0].contains(event.target) === false) {
        hideMegaMenu();
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

  const $hero = jQuery("#hero");

  if ($hero.length === 1) {
    $hero.slick({
      autoplay: true,
      autoplaySpeed: 8000,
      arrows: true,
    });
  }

  const $heroSimple = jQuery("#hero-simple");

  if ($heroSimple.length === 1) {
    $heroSimple.slick({
      autoplay: true,
      autoplaySpeed: 8000,
      arrows: true,
    });
  }

  const $roseArtProducts = jQuery("#rose-art-products");

  if ($roseArtProducts.length === 1) {
    $roseArtProducts.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: isTabletOrBigger() ? "15vw" : "28px",
      infinite: isTabletOrBigger() ? true : false,
    });
  }

  const $puzzleProducts = jQuery("#puzzle-products");

  if ($puzzleProducts.length === 1) {
    $puzzleProducts.slick({
      autoplay: false,
      arrows: true,
      dots: false,
      centerMode: true,
      centerPadding: isLargeDesktopOrBigger()
        ? getDesktopPadding()
        : isTabletOrBigger()
        ? "15vw"
        : "28px",
      infinite: isTabletOrBigger() ? true : false,
    });
  }

  const $kodakProducts = jQuery("#kodak-products");

  if ($kodakProducts.length === 1) {
    $kodakProducts.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: isLargeDesktopOrBigger()
        ? getDesktopPadding()
        : isTabletOrBigger()
        ? "15vw"
        : "28px",
      infinite: isTabletOrBigger() ? true : false,
    });
  }

  const $communityReviews = jQuery("#community-reviews");

  if ($communityReviews.length === 1 && isMobile()) {
    $communityReviews.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: "28px",
      infinite: false,
      adaptiveHeight: true,
    });
  }

  const $blogItems = jQuery("#blog-items");

  if ($blogItems.length === 1 && isMobile()) {
    $blogItems.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: "28px",
      infinite: false,
      adaptiveHeight: true,
    });
  }

  const bestSellerResponsiveBreakpoints = [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        initialSlide: 0,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        dots: false,
        infinite: true,
      },
    },
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
        dots: false,
        infinite: true,
      },
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 5,
        dots: false,
        infinite: true,
      },
    },
    {
      breakpoint: 2200,
      settings: {
        slidesToShow: 6,
        dots: false,
        infinite: true,
      },
    },
  ];

  const $bestSellers = jQuery("#best-seller-products");

  if ($bestSellers.length === 1) {
    $bestSellers.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: "28px",
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: true,
      responsive: bestSellerResponsiveBreakpoints,
    });
  }

  const $productsStackItems = jQuery(".products-stack-items");

  if ($productsStackItems.length > 0) {
    $productsStackItems.each(function () {
      jQuery(this).slick({
        autoplay: false,
        arrows: true,
        dots: true,
        dotsClass: "compact-dots",
        centerMode: true,
        centerPadding: "28px",
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        responsive: bestSellerResponsiveBreakpoints,
      });
    });
  }

  const $productVideoItems = jQuery("#product-video-items");

  if ($productVideoItems.length === 1) {
    $productVideoItems.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: isTabletOrBigger() ? "15vw" : "28px",
      infinite: isTabletOrBigger() ? true : false,
    });

    $productVideoItems.find(".product-item").magnificPopup({
      delegate: "a",
      type: "iframe",
    });
  }

  const $productHighlights = jQuery("#product-highlights");

  if ($productHighlights.length === 1) {
    $productHighlights.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: 0,
      infinite: false,
      adaptiveHeight: true,
    });
  }

  const $relatedProducts = jQuery("#related-products");

  if ($relatedProducts.length === 1) {
    $relatedProducts.slick({
      autoplay: false,
      arrows: true,
      dots: true,
      dotsClass: "compact-dots",
      centerMode: true,
      centerPadding: "28px",
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            centerMode: false,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 4,
            centerMode: false,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 1025,
          settings: "unslick",
        },
      ],
    });
  }

  jQuery(".filter-option button").on("click", function () {
    const $filter = jQuery(this);
    const filterCategory = $filter.data("option");
    const $filterItem = $filter.parent();

    if ($filterItem.hasClass("active") === false) {
      jQuery(".filter-option").not($filterItem).removeClass("active");
      jQuery(".filter-list").removeClass("active");
      $filterItem.addClass("active");
      jQuery(`.filter-list[data-option="${filterCategory}"]`).addClass(
        "active"
      );
    }
  });

  jQuery(".reveal-all-filters button").on("click", function () {
    const $revealWrapper = jQuery(this).parent();
    $revealWrapper
      .prev(".filter-items")
      .find(".filter-list")
      .addClass("revealed");
    $revealWrapper.addClass("hide");
  });

  jQuery(".puzzle-tabs button").on("click", function () {
    const $button = jQuery(this);
    const $tab = $button.parent();
    const $tabs = $tab.parent();
    const section = $button.data("section");
    const $shopPuzzles = $tab.closest("#shop-puzzles");

    if ($tab.hasClass("active") === false) {
      $shopPuzzles
        .find(".tab-content")
        .removeClass("active")
        .end()
        .find(`.tab-content[data-section="${section}"]`)
        .addClass("active");
      $tabs.find("li").removeClass("active");
      $tab.addClass("active");
      $shopPuzzles.attr("data-section", section);
    }
  });

  jQuery(".shop-puzzles .load-more button").on("click", function () {
    const $loadMore = jQuery(this).parent();
    const $button = jQuery(this);
    let containerDiv = $loadMore.prev("div");

    if (containerDiv.hasClass("reveal")) {
      containerDiv.removeClass("reveal");
      $button.text("View all");
    } else {
      containerDiv.addClass("reveal");
      $button.text("Show less");
    }

    // $loadMore.addClass("obscure");
  });

  const $artistDialog = jQuery("#artists-dialog");
  jQuery(".artists-list .artist > a").on("click", function (event) {
    event.preventDefault();

    const $artist = jQuery(this).parent().clone();
    $artistDialog.find(".info").empty().append($artist);

    jQuery.magnificPopup.open({
      type: "inline",
      items: {
        src: "#artists-dialog",
      },
    });
  });

  let currentUrl = window.location.href;
  const $shopWrapper = jQuery(".wcf-shop-wrapper");

  const pagesToObserve = ["puzzles"];

  const mutationObserver = new MutationObserver((entries) => {
    const newUrl = window.location.href;
    const isPageObservable = pagesToObserve.filter((p) =>
      currentUrl.includes(p)
    );

    if (currentUrl != newUrl && $shopWrapper.length === 1) {
      jQuery("html, body").animate(
        {
          scrollTop: $shopWrapper.offset().top,
        },
        800
      );
      currentUrl = newUrl;
    }
  });

  const productList = document.querySelector("#product-list");

  if (productList != null) {
    mutationObserver.observe(productList, {
      childList: true,
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

  function isMobile() {
    return windowWidth < 768;
  }

  function isTabletOrBigger() {
    return windowWidth >= 1025;
  }

  function isLargeDesktopOrBigger() {
    return windowWidth >= 1800;
  }

  function getDesktopPadding() {
    return `${Math.round(windowWidth - 1000) / 2}px`;
  }

  jQuery(window).on("resize", function () {
    debouncedMiniProductsUpdater();
  });
});
