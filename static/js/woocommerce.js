jQuery(document).ready(function () {
  jQuery(".filter__header .filter__title").on("click", function () {
    const $filterItem = jQuery(this).closest(".filter__item");

    $filterItem.find(".filter__properties-list").toggleClass("active");
  });

  const $filtersContainer = jQuery(".premmerce-filter-ajax-container");

  const $filters = jQuery(".widget_premmerce_filter_filter_widget");

  const $filterProducts = jQuery(
    `<button class="filter-products">Show filters</button>`
  );

  $filterProducts.on("click", function () {
    const $button = jQuery(this);
    if ($filters.hasClass("show")) {
      $filters.removeClass("show");
      $button.text("Show filters");
    } else {
      $filters.addClass("show");
      $button.text("Hide filters");
    }
  });

  $filtersContainer.prepend($filterProducts);

  jQuery(".na-wc-learn-more").on("click", function () {
    jQuery("html, body").animate(
      {
        scrollTop: jQuery("#accordion-container").offset().top,
      },
      1000
    );
  });
});
