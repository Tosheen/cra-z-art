jQuery(document).ready(function () {
  jQuery(".filter--style-premmerce .filter__title").on("click", function () {
    const $filterItem = jQuery(this).closest(".filter__item");

    $filterItem.find(".filter__properties-list").toggleClass("active");
  });
});
