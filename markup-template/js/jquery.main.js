var $ = jQuery.noConflict();
jQuery(document).ready(function() {
	isElementExist(".nav-drop", initSmartMenu);
	initCustomForms();
	isElementExist(".swiper-container", initSwiper);
	isElementExist("#lang", ddSlick);
	isElementExist(".images .swiper-container", initSwiperImages)
	isElementExist(".tab-to-accordion", initTabsToAccordion);
	amountInput();
	isElementExist(".quick-view", popupHider);
});

//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------

// Helper if element exist then call function
function isElementExist(_el, _cb) {
	var elem = document.querySelector(_el);

	if (document.body.contains(elem)) {
		try {
			_cb();
		} catch(e) {
			console.log(e);
		}
	}
}

// initialize custom form elements (checkbox, radio, select) https://github.com/w3co/jcf
function initCustomForms() {
	jcf.setOptions('Select', {
		maxVisibleItems: 5, // visible dropdown items before scroll appear
		wrapNative: false,
	});
	jcf.replaceAll();
}

// smart menu init
function initSmartMenu() {
	var distanceBetweenMenuAndNav = jQuery(".header-menu-wrapper").offset().top + jQuery(".header-menu-wrapper").innerHeight() - jQuery(".nav").offset().top - jQuery(".nav").innerHeight();
	jQuery(".header-menu").smartmenus({
		collapsibleBehavior: "accordion",
		mainMenuSubOffsetY: distanceBetweenMenuAndNav
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery('.header-menu').children().last().addClass('nav-sm-reverse');

	jQuery("body").mobileNav({
		menuActiveClass: "nav-active",
		menuOpener: ".nav-opener",
		hideOnClickOutside: true,
		menuDrop: ".nav-drop"
	}), "ontouchstart" in document.documentElement ||
			jQuery(window).on("resize orientationchange", function() {
				jQuery("body").removeClass("nav-active"), $.SmartMenus.hideAll();
	});
}

// swiper init
function initSwiper() {
	const swiper = new Swiper('.slider .swiper-container', {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 380,
		speed: 500,

		// If we need pagination
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},

		// Navigation arrows
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
}

// ddSlick init
function ddSlick() {
	$('#lang').ddslick({
		width: 125,
		background: 'transparent',
		onSelected: function(selectedData){
				//callback function: do something with selectedData;
		}
	})
}

function initSwiperImages() {
	const sliderThumbs = new Swiper('.images__thumbs .swiper-container', { // ищем слайдер превью по селектору
		// задаем параметры
		direction: 'vertical', // вертикальная прокрутка
		slidesPerView: 4, // показывать по 3 превью
		spaceBetween: 24, // расстояние между слайдами
		freeMode: true, // при перетаскивании превью ведет себя как при скролле
	});

	// Инициализация слайдера изображений
	const sliderImages = new Swiper('.images__images .swiper-container', { // ищем слайдер по селектору
		// задаем параметры
		direction: 'vertical', // вертикальная прокрутка
		slidesPerView: 1, // показывать по 1 изображению
		spaceBetween: 8, // расстояние между слайдами
		mousewheel: true, // можно прокручивать изображения колёсиком мыши
		grabCursor: true, // менять иконку курсора
		thumbs: { // указываем на превью слайдер
			swiper: sliderThumbs // указываем имя превью слайдера
		},
	});
}

//JS tabs to accordion
function initTabsToAccordion() {
	var animSpeed = 500;
	var win = $(window);
	var isAccordionMode = true;
	var tabWrap = $(".tab-to-accordion");
	var tabContainer = tabWrap.find(".tab-container");
	var tabItem = tabContainer.children("div[id]");
	var tabsetList = tabWrap.find(".tabset-list");
	var tabsetLi = tabsetList.find("li");
	var tabsetItem = tabsetList.find("a");
	var activeId = tabsetList
		.find(".active")
		.children()
		.attr("href");
	cloneTabsToAccordion();
	accordionMode();
	tabsToggle();
	hashToggle();
	win.on("resize orientationchange", accordionMode);
	function cloneTabsToAccordion() {
		$(tabsetItem).each(function() {
			var $this = $(this);
			var activeClass = $this.parent().hasClass("active");
			var listItem = $this.attr("href");
			var listTab = $(listItem);
			if (activeClass) {
				var activeClassId = listItem;
				listTab.show();
			}
			var itemContent = $this.clone();
			var itemTab = $this.attr("href");
			if (activeClassId) {
				itemContent
					.insertBefore(itemTab)
					.wrap('<div class="accordion-item active"></div>');
			} else {
				itemContent
					.insertBefore(itemTab)
					.wrap('<div class="accordion-item"></div>');
			}
		});
	}
	function accordionMode() {
		var liWidth = Math.round(tabsetLi.outerWidth());
		var liCount = tabsetLi.length;
		var allLiWidth = liWidth * liCount;
		var tabsetListWidth = tabsetList.outerWidth();
		if (tabsetListWidth <= allLiWidth) {
			isAccordionMode = true;
			tabWrap.addClass("accordion-mod");
		} else {
			isAccordionMode = false;
			tabWrap.removeClass("accordion-mod");
		}
	}
	function tabsToggle() {
		tabItem.hide();
		$(activeId).show();
		$(tabWrap).on("click", 'a[href^="#tab"]', function(e) {
			e.preventDefault();
			var $this = $(this);
			var activeId = $this.attr("href");
			var activeTabSlide = $(activeId);
			var activeOpener = tabWrap.find('a[href="' + activeId + '"]');
			$('a[href^="#tab"]')
				.parent()
				.removeClass("active");
			activeOpener.parent().addClass("active");
			if (isAccordionMode) {
				tabItem.stop().slideUp(animSpeed);
				activeTabSlide.stop().slideDown(animSpeed);
			} else {
				tabItem.hide();
				activeTabSlide.show();
			}
		});
	}
	function hashToggle() {
		var hash = location.hash;
		var activeId = hash;
		var activeTabSlide = $(activeId);
		var activeOpener = tabWrap.find('a[href="' + activeId + '"]');
		if ($(hash).length > 0) {
			$('a[href^="#tab"]')
				.parent()
				.removeClass("active");
			activeOpener.parent().addClass("active");
			tabItem.hide();
			activeTabSlide.show();
			win
				.scrollTop(activeTabSlide.offset().top)
				.scrollLeft(activeTabSlide.offset().left);
		}
	}
}

//amount input
function amountInput() {
	// Убавляем кол-во по клику
	$('.quantity_inner .bt_minus').click(function() {
		let $input = $(this).parent().find('.quantity');
		let count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
	});
	// Прибавляем кол-во по клику
	$('.quantity_inner .bt_plus').click(function() {
		let $input = $(this).parent().find('.quantity');
		let count = parseInt($input.val()) + 1;
		count = count > parseInt($input.data('max-count')) ? parseInt($input.data('max-count')) : count;
		$input.val(parseInt(count));
	});
	// Убираем все лишнее и невозможное при изменении поля
	$('.quantity_inner .quantity').bind("change keyup input click", function() {
		if (this.value.match(/[^0-9]/g)) {
				this.value = this.value.replace(/[^0-9]/g, '');
		}
		if (this.value == "") {
				this.value = 1;
		}
		if (this.value > parseInt($(this).data('max-count'))) {
				this.value = parseInt($(this).data('max-count'));
		}
	});
}

//popup hider
function popupHider() {
	const qvPopup = document.querySelector('.quick-view');
	setTimeout(() => qvPopup.classList.add('putout'), 500);
}

//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------

//-------- -------- -------- --------
//-------- included js libs start
//-------- -------- -------- --------

// custom helper function for debounce - how to work see https://codepen.io/Hyubert/pen/abZmXjm
//= vendors/debounce.js

// library smartmenus (if you dont have menu in the project - just remove)
//= vendors/smartmenus.js

// jcf library select, radio, checkbox modules
//= vendors/jcf.js

// swiper (https://swiperjs.com/)
//= vendors/swiper-bundle.min.js

// ddStick https://designwithpc.com/Plugins/ddSlick
//= vendors/jquery.ddslick.min.js

//fancybox
//= vendors/fancybox.umd.js

//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
