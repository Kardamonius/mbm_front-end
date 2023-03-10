(() => {
	"use strict";
	const flsModules = {};
	function getHash() {
		if (location.hash) return location.hash.replace("#", "");
	}
	function setHash(hash) {
		hash = hash ? `#${hash}` : window.location.href.split("#")[0];
		history.pushState("", "", hash);
	}
	let _slideUp = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = `${target.offsetHeight}px`;
			target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout((() => {
				target.hidden = !showmore ? true : false;
				!showmore ? target.style.removeProperty("height") : null;
				target.style.removeProperty("padding-top");
				target.style.removeProperty("padding-bottom");
				target.style.removeProperty("margin-top");
				target.style.removeProperty("margin-bottom");
				!showmore ? target.style.removeProperty("overflow") : null;
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
				document.dispatchEvent(new CustomEvent("slideUpDone", {
					detail: {
						target
					}
				}));
			}), duration);
		}
	};
	let _slideDown = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			target.hidden = target.hidden ? false : null;
			showmore ? target.style.removeProperty("height") : null;
			let height = target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = height + "px";
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			window.setTimeout((() => {
				target.style.removeProperty("height");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
				document.dispatchEvent(new CustomEvent("slideDownDone", {
					detail: {
						target
					}
				}));
			}), duration);
		}
	};
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
	};
	let bodyLockStatus = true;
	let bodyUnlock = (delay = 500) => {
		let body = document.querySelector("body");
		if (bodyLockStatus) {
			let lock_padding = document.querySelectorAll("[data-lp]");
			setTimeout((() => {
				for (let index = 0; index < lock_padding.length; index++) {
					const el = lock_padding[index];
					el.style.paddingRight = "0px";
				}
				body.style.paddingRight = "0px";
				document.documentElement.classList.remove("lock");
			}), delay);
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	function tabs() {
		const tabs = document.querySelectorAll("[data-tabs]");
		let tabsActiveHash = [];
		if (tabs.length > 0) {
			const hash = getHash();
			if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
			tabs.forEach(((tabsBlock, index) => {
				tabsBlock.classList.add("_tab-init");
				tabsBlock.setAttribute("data-tabs-index", index);
				tabsBlock.addEventListener("click", setTabsAction);
				initTabs(tabsBlock);
			}));
			let mdQueriesArray = dataMediaQueries(tabs, "tabs");
			if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", (function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				}));
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			}));
		}
		function setTitlePosition(tabsMediaArray, matchMedia) {
			tabsMediaArray.forEach((tabsMediaItem => {
				tabsMediaItem = tabsMediaItem.item;
				let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
				let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
				let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
				let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
				tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
				tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
				tabsContentItems.forEach(((tabsContentItem, index) => {
					if (matchMedia.matches) {
						tabsContent.append(tabsTitleItems[index]);
						tabsContent.append(tabsContentItem);
						tabsMediaItem.classList.add("_tab-spoller");
					} else {
						tabsTitles.append(tabsTitleItems[index]);
						tabsMediaItem.classList.remove("_tab-spoller");
					}
				}));
			}));
		}
		function initTabs(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
			let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
			if (tabsActiveHashBlock) {
				const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
				tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
			}
			if (tabsContent.length) {
				tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsContent.forEach(((tabsContentItem, index) => {
					tabsTitles[index].setAttribute("data-tabs-title", "");
					tabsContentItem.setAttribute("data-tabs-item", "");
					if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
					tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
				}));
			}
		}
		function setTabsStatus(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
			let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			function isTabsAnamate(tabsBlock) {
				if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
			const tabsBlockAnimate = isTabsAnamate(tabsBlock);
			if (tabsContent.length > 0) {
				const isHash = tabsBlock.hasAttribute("data-tabs-hash");
				tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsContent.forEach(((tabsContentItem, index) => {
					if (tabsTitles[index].classList.contains("_tab-active")) {
						if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
						if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
					} else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
				}));
			}
		}
		function setTabsAction(e) {
			const el = e.target;
			if (el.closest("[data-tabs-title]")) {
				const tabTitle = el.closest("[data-tabs-title]");
				const tabsBlock = tabTitle.closest("[data-tabs]");
				if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
					let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
					tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
					tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
					tabTitle.classList.add("_tab-active");
					setTabsStatus(tabsBlock);
				}
				e.preventDefault();
			}
		}
	}
	function menuClose() {
		bodyUnlock();
		document.documentElement.classList.remove("menu-open");
	}
	function FLS(message) {
		setTimeout((() => {
			if (window.FLS) console.log(message);
		}), 0);
	}
	function uniqArray(array) {
		return array.filter((function (item, index, self) {
			return self.indexOf(item) === index;
		}));
	}
	function dataMediaQueries(array, dataSetValue) {
		const media = Array.from(array).filter((function (item, index, self) {
			if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
		}));
		if (media.length) {
			const breakpointsArray = [];
			media.forEach((item => {
				const params = item.dataset[dataSetValue];
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			}));
			let mdQueries = breakpointsArray.map((function (item) {
				return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
			}));
			mdQueries = uniqArray(mdQueries);
			const mdQueriesArray = [];
			if (mdQueries.length) {
				mdQueries.forEach((breakpoint => {
					const paramsArray = breakpoint.split(",");
					const mediaBreakpoint = paramsArray[1];
					const mediaType = paramsArray[2];
					const matchMedia = window.matchMedia(paramsArray[0]);
					const itemsArray = breakpointsArray.filter((function (item) {
						if (item.value === mediaBreakpoint && item.type === mediaType) return true;
					}));
					mdQueriesArray.push({
						itemsArray,
						matchMedia
					});
				}));
				return mdQueriesArray;
			}
		}
	}
	let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
		const targetBlockElement = document.querySelector(targetBlock);
		if (targetBlockElement) {
			let headerItem = "";
			let headerItemHeight = 0;
			if (noHeader) {
				headerItem = "header.header";
				const headerElement = document.querySelector(headerItem);
				if (!headerElement.classList.contains("_header-scroll")) {
					headerElement.style.cssText = `transition-duration: 0s;`;
					headerElement.classList.add("_header-scroll");
					headerItemHeight = headerElement.offsetHeight;
					headerElement.classList.remove("_header-scroll");
					setTimeout((() => {
						headerElement.style.cssText = ``;
					}), 0);
				} else headerItemHeight = headerElement.offsetHeight;
			}
			let options = {
				speedAsDuration: true,
				speed,
				header: headerItem,
				offset: offsetTop,
				easing: "easeOutQuad"
			};
			document.documentElement.classList.contains("menu-open") ? menuClose() : null;
			if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
				let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
				targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
				targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
				window.scrollTo({
					top: targetBlockElementPosition,
					behavior: "smooth"
				});
			}
			FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
		} else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
	};
	function formFieldsInit(options = {
		viewPass: false,
		autoHeight: false
	}) {
		const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
		if (formFields.length) formFields.forEach((formField => {
			if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
		}));
		document.body.addEventListener("focusin", (function (e) {
			const targetElement = e.target;
			if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
				if (targetElement.dataset.placeholder) targetElement.placeholder = "";
				if (!targetElement.hasAttribute("data-no-focus-classes")) {
					targetElement.classList.add("_form-focus");
					targetElement.parentElement.classList.add("_form-focus");
				}
				formValidate.removeError(targetElement);
			}
		}));
		document.body.addEventListener("focusout", (function (e) {
			const targetElement = e.target;
			if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
				if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
				if (!targetElement.hasAttribute("data-no-focus-classes")) {
					targetElement.classList.remove("_form-focus");
					targetElement.parentElement.classList.remove("_form-focus");
				}
				if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
			}
		}));
		if (options.viewPass) document.addEventListener("click", (function (e) {
			let targetElement = e.target;
			if (targetElement.closest('[class*="__viewpass"]')) {
				let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
				targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
				targetElement.classList.toggle("_viewpass-active");
			}
		}));
		if (options.autoHeight) {
			const textareas = document.querySelectorAll("textarea[data-autoheight]");
			if (textareas.length) {
				textareas.forEach((textarea => {
					const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
					const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
					setHeight(textarea, Math.min(startHeight, maxHeight));
					textarea.addEventListener("input", (() => {
						if (textarea.scrollHeight > startHeight) {
							textarea.style.height = `auto`;
							setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
						}
					}));
				}));
				function setHeight(textarea, height) {
					textarea.style.height = `${height}px`;
				}
			}
		}
	}
	let formValidate = {
		getErrors(form) {
			let error = 0;
			let formRequiredItems = form.querySelectorAll("*[data-required]");
			if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
				if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
			}));
			return error;
		},
		validateInput(formRequiredItem) {
			let error = 0;
			if ("email" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (this.emailTest(formRequiredItem)) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("phone" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (this.phoneTest(formRequiredItem)) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("lang" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (this.langTest(formRequiredItem)) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("pass-reg" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (this.passRegTest(formRequiredItem)) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("pass-submit" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (document.querySelector("#pass-reg-submit").value !== document.querySelector("#pass-reg").value) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("reset-pass-submit" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (document.querySelector("#reset-pass-submit").value !== document.querySelector("#reset-pass-new").value) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("checkout-pass-submit" === formRequiredItem.dataset.required) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
				if (document.querySelector("#checkout-reg-pass-submit").value !== document.querySelector("#checkout-reg-pass").value) {
					this.addError(formRequiredItem);
					error++;
				} else this.removeError(formRequiredItem);
			} else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
				this.addError(formRequiredItem);
				error++;
			} else if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else this.removeError(formRequiredItem);
			return error;
		},
		addError(formRequiredItem) {
			formRequiredItem.classList.add("_form-error");
			formRequiredItem.parentElement.classList.add("_form-error");
			//formRequiredItem.closest("form").classList.add("_form-error");
			let inputError = formRequiredItem.parentElement.querySelector(".form__error");
			if (inputError) formRequiredItem.parentElement.removeChild(inputError);
			if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
		},
		removeError(formRequiredItem) {
			formRequiredItem.classList.remove("_form-error");
			formRequiredItem.parentElement.classList.remove("_form-error");
			//formRequiredItem.closest("form").classList.remove("_form-error");
			if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
		},
		formClean(form) {
			form.reset();
			setTimeout((() => {
				let inputs = form.querySelectorAll("input,textarea");
				for (let index = 0; index < inputs.length; index++) {
					const el = inputs[index];
					el.parentElement.classList.remove("_form-focus");
					el.classList.remove("_form-focus");
					formValidate.removeError(el);
				}
				let checkboxes = form.querySelectorAll(".checkbox__input");
				if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
				if (flsModules.select) {
					let selects = form.querySelectorAll(".select");
					if (selects.length) for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector("select");
						flsModules.select.selectBuild(select);
					}
				}
			}), 0);
		},
		emailTest(formRequiredItem) {
			return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
		},
		phoneTest(formRequiredItem) {
			return !/(\+38)?\(?0(39|44|50|63|66|67|68|91|92|93|94|95|96|98|99)\)?\-?(\d{3})\-?(\d{2})\-?(\d{2})/g.test(formRequiredItem.value);
		},
		passRegTest(formRequiredItem) {
			return !/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(formRequiredItem.value);
		},
		langTest(formRequiredItem) {
			return !/^[а-яА-Яє-їЄ-Ї0-9_\.]+$/.test(formRequiredItem.value);
		}
	};
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) for (const form of forms) {
			form.addEventListener("submit", (function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			}));
			form.addEventListener("reset", (function (e) {
				const form = e.target;
				formValidate.formClean(form);
			}));
		}
		async function formSubmitAction(form, e) {
			const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
			if (0 === error) {
				const ajax = form.hasAttribute("data-ajax");
				if (ajax) {
					e.preventDefault();
					const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
					const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
					const formData = new FormData(form);
					form.classList.add("_sending");
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json();
						form.classList.remove("_sending");
						formSent(form, responseResult);
					} else {
						alert("Ошибка");
						form.classList.remove("_sending");
					}
				} else if (form.hasAttribute("data-dev")) {
					e.preventDefault();
					formSent(form);
				}
			} else {
				e.preventDefault();
				if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
					const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
					gotoBlock(formGoToErrorClass, true, 1e3);
				}
			}
		}
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", {
				detail: {
					form
				}
			}));
			setTimeout((() => {
				if (flsModules.popup) {
					const popup = form.dataset.popupMessage;
					popup ? flsModules.popup.open(popup) : null;
				}
			}), 0);
			formValidate.formClean(form);
			formLogging(`Форма отправлена!`);
		}
		function formLogging(message) {
			FLS(`[Формы]: ${message}`);
		}
	}
	function formQuantity() {
		document.addEventListener("click", (function (e) {
			let targetElement = e.target;
			if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
				const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute("data-quantity-plus")) {
					value++;
					if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
				} else {
					--value;
					if (+valueElement.dataset.quantityMin) {
						if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
					} else if (value < 1) value = 1;
				}
				targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
			}
		}));
	}
	if (document.querySelector(".checkout") && !document.querySelector(".product")) {
		class SelectConstructor {
			constructor(props, data = null) {
				let defaultConfig = {
					init: true,
					logging: true
				};
				this.config = Object.assign(defaultConfig, props);
				this.selectClasses = {
					classSelect: "select",
					classSelectBody: "select__body",
					classSelectTitle: "select__title",
					classSelectValue: "select__value",
					classSelectLabel: "select__label",
					classSelectInput: "select__input",
					classSelectText: "select__text",
					classSelectLink: "select__link",
					classSelectOptions: "select__options",
					classSelectOptionsScroll: "select__scroll",
					classSelectOption: "select__option",
					classSelectContent: "select__content",
					classSelectRow: "select__row",
					classSelectData: "select__asset",
					classSelectDisabled: "_select-disabled",
					classSelectTag: "_select-tag",
					classSelectOpen: "_select-open",
					classSelectActive: "_select-active",
					classSelectFocus: "_select-focus",
					classSelectMultiple: "_select-multiple",
					classSelectCheckBox: "_select-checkbox",
					classSelectOptionSelected: "_select-selected",
					classSelectPseudoLabel: "_select-pseudo-label"
				};
				this._this = this;
				if (this.config.init) {
					const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
					if (selectItems.length) {
						this.selectsInit(selectItems);
						this.setLogging(`Проснулся, построил селектов: (${selectItems.length})`);
					} else this.setLogging("Сплю, нет ни одного select zzZZZzZZz");
				}
			}
			getSelectClass(className) {
				return `.${className}`;
			}
			getSelectElement(selectItem, className) {
				return {
					originalSelect: selectItem.querySelector("select"),
					selectElement: selectItem.querySelector(this.getSelectClass(className))
				};
			}
			selectsInit(selectItems) {
				selectItems.forEach(((originalSelect, index) => {
					this.selectInit(originalSelect, index + 1);
				}));
				document.addEventListener("click", function (e) {
					this.selectsActions(e);
				}.bind(this));
				document.addEventListener("keydown", function (e) {
					this.selectsActions(e);
				}.bind(this));
				document.addEventListener("focusin", function (e) {
					this.selectsActions(e);
				}.bind(this));
				document.addEventListener("focusout", function (e) {
					this.selectsActions(e);
				}.bind(this));
			}
			selectInit(originalSelect, index) {
				const _this = this;
				let selectItem = document.createElement("div");
				selectItem.classList.add(this.selectClasses.classSelect);
				originalSelect.parentNode.insertBefore(selectItem, originalSelect);
				selectItem.appendChild(originalSelect);
				originalSelect.hidden = true;
				index ? originalSelect.dataset.id = index : null;
				if (this.getSelectPlaceholder(originalSelect)) {
					originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
					if (this.getSelectPlaceholder(originalSelect).label.show) {
						const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
						selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
					}
				}
				selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
				this.selectBuild(originalSelect);
				originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
				originalSelect.addEventListener("change", (function (e) {
					_this.selectChange(e);
				}));
			}
			selectBuild(originalSelect) {
				const selectItem = originalSelect.parentElement;
				selectItem.dataset.id = originalSelect.dataset.id;
				originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
				originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
				originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
				this.setSelectTitleValue(selectItem, originalSelect);
				this.setOptions(selectItem, originalSelect);
				originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
				originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
				this.selectDisabled(selectItem, originalSelect);
			}
			selectsActions(e) {
				const targetElement = e.target;
				const targetType = e.type;
				if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
					const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
					const originalSelect = this.getSelectElement(selectItem).originalSelect;
					if ("click" === targetType) {
						if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
							const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
							const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
							this.optionAction(selectItem, originalSelect, optionItem);
						} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
							const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
							this.optionAction(selectItem, originalSelect, optionItem);
						}
					} else if ("focusin" === targetType || "focusout" === targetType) {
						if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) "focusin" === targetType ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
					} else if ("keydown" === targetType && "Escape" === e.code) this.selectsСlose();
				} else this.selectsСlose();
			}
			selectsСlose(selectOneGroup) {
				const selectsGroup = selectOneGroup ? selectOneGroup : document;
				const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
				if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
					this.selectСlose(selectActiveItem);
				}));
			}
			selectСlose(selectItem) {
				const originalSelect = this.getSelectElement(selectItem).originalSelect;
				const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
				if (!selectOptions.classList.contains("_slide")) {
					selectItem.classList.remove(this.selectClasses.classSelectOpen);
					_slideUp(selectOptions, originalSelect.dataset.speed);
				}
			}
			selectAction(selectItem) {
				const originalSelect = this.getSelectElement(selectItem).originalSelect;
				const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
				if (originalSelect.closest("[data-one-select]")) {
					const selectOneGroup = originalSelect.closest("[data-one-select]");
					this.selectsСlose(selectOneGroup);
				}
				if (!selectOptions.classList.contains("_slide")) {
					selectItem.classList.toggle(this.selectClasses.classSelectOpen);
					_slideToggle(selectOptions, originalSelect.dataset.speed);
				}
			}
			setSelectTitleValue(selectItem, originalSelect) {
				const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
				const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
				if (selectItemTitle) selectItemTitle.remove();
				selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
			}
			getSelectTitleValue(selectItem, originalSelect) {
				let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
				if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
					selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
					if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
						document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
						if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
					}
				}
				selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
				let pseudoAttribute = "";
				let pseudoAttributeClass = "";
				if (originalSelect.hasAttribute("data-pseudo-label")) {
					pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заполните атрибут"`;
					pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
				}
				this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
				if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
					const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
					return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
				}
			}
			getSelectElementContent(selectOption) {
				const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
				const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
				let selectOptionContentHTML = ``;
				selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
				selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
				selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
				selectOptionContentHTML += selectOptionData ? `</span>` : "";
				selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
				selectOptionContentHTML += selectOption.textContent;
				selectOptionContentHTML += selectOptionData ? `</span>` : "";
				selectOptionContentHTML += selectOptionData ? `</span>` : "";
				return selectOptionContentHTML;
			}
			getSelectPlaceholder(originalSelect) {
				const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
				if (selectPlaceholder) return {
					value: selectPlaceholder.textContent,
					show: selectPlaceholder.hasAttribute("data-show"),
					label: {
						show: selectPlaceholder.hasAttribute("data-label"),
						text: selectPlaceholder.dataset.label
					}
				};
			}
			getSelectedOptionsData(originalSelect, type) {
				let selectedOptions = [];
				if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
				return {
					elements: selectedOptions.map((option => option)),
					values: selectedOptions.filter((option => option.value)).map((option => option.value)),
					html: selectedOptions.map((option => this.getSelectElementContent(option)))
				};
			}
			getOptions(originalSelect) {
				let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
				let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
				let selectOptions = Array.from(originalSelect.options);
				if (selectOptions.length > 0) {
					let selectOptionsHTML = ``;
					if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
					selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
					selectOptions.forEach((selectOption => {
						selectOptionsHTML += this.getOption(selectOption, originalSelect);
					}));
					selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
					return selectOptionsHTML;
				}
			}
			getOption(selectOption, originalSelect) {
				const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
				const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
				const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
				const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
				const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
				let selectOptionHTML = ``;
				selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
				selectOptionHTML += this.getSelectElementContent(selectOption);
				selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
				return selectOptionHTML;
			}
			setOptions(selectItem, originalSelect) {
				const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
				selectItemOptions.innerHTML = this.getOptions(originalSelect);
			}
			optionAction(selectItem, originalSelect, optionItem) {
				if (originalSelect.multiple) {
					optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
					const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
					originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
						originalSelectSelectedItem.removeAttribute("selected");
					}));
					const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
					selectSelectedItems.forEach((selectSelectedItems => {
						originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
					}));
				} else {
					if (!originalSelect.hasAttribute("data-show-selected")) {
						if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
						optionItem.hidden = true;
					}
					originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
					this.selectAction(selectItem);
				}
				this.setSelectTitleValue(selectItem, originalSelect);
				this.setSelectChange(originalSelect);
			}
			selectChange(e) {
				const originalSelect = e.target;
				this.selectBuild(originalSelect);
				this.setSelectChange(originalSelect);
			}
			setSelectChange(originalSelect) {
				if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
				if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
					let tempButton = document.createElement("button");
					tempButton.type = "submit";
					originalSelect.closest("form").append(tempButton);
					tempButton.click();
					tempButton.remove();
				}
				const selectItem = originalSelect.parentElement;
				this.selectCallback(selectItem, originalSelect);
			}
			selectDisabled(selectItem, originalSelect) {
				if (originalSelect.disabled) {
					selectItem.classList.add(this.selectClasses.classSelectDisabled);
					this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
				} else {
					selectItem.classList.remove(this.selectClasses.classSelectDisabled);
					this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
				}
			}
			searchActions(selectItem) {
				this.getSelectElement(selectItem).originalSelect;
				const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
				const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
				const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
				const _this = this;
				selectInput.addEventListener("input", (function () {
					selectOptionsItems.forEach((selectOptionsItem => {
						if (selectOptionsItem.textContent.toUpperCase().indexOf(selectInput.value.toUpperCase()) >= 0) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
					}));
					true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
				}));
			}
			selectCallback(selectItem, originalSelect) {
				document.dispatchEvent(new CustomEvent("selectCallback", {
					detail: {
						select: originalSelect
					}
				}));
			}
			setLogging(message) {
				this.config.logging ? FLS(`[select]: ${message}`) : null;
			}
		}
		flsModules.select = new SelectConstructor({});
	}
	class DynamicAdapt {
		constructor(type) {
			this.type = type;
		}
		init() {
			this.оbjects = [];
			this.daClassname = "_dynamic_adapt_";
			this.nodes = [...document.querySelectorAll("[data-da]")];
			this.nodes.forEach((node => {
				const data = node.dataset.da.trim();
				const dataArray = data.split(",");
				const оbject = {};
				оbject.element = node;
				оbject.parent = node.parentNode;
				оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
				оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
				оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
				оbject.index = this.indexInParent(оbject.parent, оbject.element);
				this.оbjects.push(оbject);
			}));
			this.arraySort(this.оbjects);
			this.mediaQueries = this.оbjects.map((({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
			this.mediaQueries.forEach((media => {
				const mediaSplit = media.split(",");
				const matchMedia = window.matchMedia(mediaSplit[0]);
				const mediaBreakpoint = mediaSplit[1];
				const оbjectsFilter = this.оbjects.filter((({ breakpoint }) => breakpoint === mediaBreakpoint));
				matchMedia.addEventListener("change", (() => {
					this.mediaHandler(matchMedia, оbjectsFilter);
				}));
				this.mediaHandler(matchMedia, оbjectsFilter);
			}));
		}
		mediaHandler(matchMedia, оbjects) {
			if (matchMedia.matches) оbjects.forEach((оbject => {
				this.moveTo(оbject.place, оbject.element, оbject.destination);
			})); else оbjects.forEach((({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
			}));
		}
		moveTo(place, element, destination) {
			element.classList.add(this.daClassname);
			if ("last" === place || place >= destination.children.length) {
				destination.append(element);
				return;
			}
			if ("first" === place) {
				destination.prepend(element);
				return;
			}
			destination.children[place].before(element);
		}
		moveBack(parent, element, index) {
			element.classList.remove(this.daClassname);
			if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
		}
		indexInParent(parent, element) {
			return [...parent.children].indexOf(element);
		}
		arraySort(arr) {
			if ("min" === this.type) arr.sort(((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) return 0;
					if ("first" === a.place || "last" === b.place) return -1;
					if ("last" === a.place || "first" === b.place) return 1;
					return 0;
				}
				return a.breakpoint - b.breakpoint;
			})); else {
				arr.sort(((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) return 0;
						if ("first" === a.place || "last" === b.place) return 1;
						if ("last" === a.place || "first" === b.place) return -1;
						return 0;
					}
					return b.breakpoint - a.breakpoint;
				}));
				return;
			}
		}
	}
	const da = new DynamicAdapt("max");
	da.init();
	/*!
* lightgallery | 2.7.0 | October 9th 2022
* http://www.lightgalleryjs.com/
* Copyright (c) 2020 Sachin Neravath;
* @license GPLv3
*/
	(function (global, factory) {
		"object" === typeof exports && "undefined" !== typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define(factory) : (global = "undefined" !== typeof globalThis ? globalThis : global || self,
			global.lightGallery = factory());
	})(void 0, (function () {
		"use strict";
        /*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */        var __assign = function () {
			__assign = Object.assign || function __assign(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
			return __assign.apply(this, arguments);
		};
		function __spreadArrays() {
			for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
			var r = Array(s), k = 0;
			for (i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++,
				k++) r[k] = a[j];
			return r;
		}
		var lGEvents = {
			afterAppendSlide: "lgAfterAppendSlide",
			init: "lgInit",
			hasVideo: "lgHasVideo",
			containerResize: "lgContainerResize",
			updateSlides: "lgUpdateSlides",
			afterAppendSubHtml: "lgAfterAppendSubHtml",
			beforeOpen: "lgBeforeOpen",
			afterOpen: "lgAfterOpen",
			slideItemLoad: "lgSlideItemLoad",
			beforeSlide: "lgBeforeSlide",
			afterSlide: "lgAfterSlide",
			posterClick: "lgPosterClick",
			dragStart: "lgDragStart",
			dragMove: "lgDragMove",
			dragEnd: "lgDragEnd",
			beforeNextSlide: "lgBeforeNextSlide",
			beforePrevSlide: "lgBeforePrevSlide",
			beforeClose: "lgBeforeClose",
			afterClose: "lgAfterClose",
			rotateLeft: "lgRotateLeft",
			rotateRight: "lgRotateRight",
			flipHorizontal: "lgFlipHorizontal",
			flipVertical: "lgFlipVertical",
			autoplay: "lgAutoplay",
			autoplayStart: "lgAutoplayStart",
			autoplayStop: "lgAutoplayStop"
		};
		var lightGalleryCoreSettings = {
			mode: "lg-slide",
			easing: "ease",
			speed: 400,
			licenseKey: "0000-0000-000-0000",
			height: "100%",
			width: "100%",
			addClass: "",
			startClass: "lg-start-zoom",
			backdropDuration: 300,
			container: "",
			startAnimationDuration: 400,
			zoomFromOrigin: true,
			hideBarsDelay: 0,
			showBarsAfter: 1e4,
			slideDelay: 0,
			supportLegacyBrowser: true,
			allowMediaOverlap: false,
			videoMaxSize: "1280-720",
			loadYouTubePoster: true,
			defaultCaptionHeight: 0,
			ariaLabelledby: "",
			ariaDescribedby: "",
			resetScrollPosition: true,
			hideScrollbar: false,
			closable: true,
			swipeToClose: true,
			closeOnTap: true,
			showCloseIcon: true,
			showMaximizeIcon: false,
			loop: true,
			escKey: true,
			keyPress: true,
			trapFocus: true,
			controls: true,
			slideEndAnimation: true,
			hideControlOnEnd: false,
			mousewheel: false,
			getCaptionFromTitleOrAlt: true,
			appendSubHtmlTo: ".lg-sub-html",
			subHtmlSelectorRelative: false,
			preload: 2,
			numberOfSlideItemsInDom: 10,
			selector: "",
			selectWithin: "",
			nextHtml: "",
			prevHtml: "",
			index: 0,
			iframeWidth: "100%",
			iframeHeight: "100%",
			iframeMaxWidth: "100%",
			iframeMaxHeight: "100%",
			download: true,
			counter: true,
			appendCounterTo: ".lg-toolbar",
			swipeThreshold: 50,
			enableSwipe: true,
			enableDrag: true,
			dynamic: false,
			dynamicEl: [],
			extraProps: [],
			exThumbImage: "",
			isMobile: void 0,
			mobileSettings: {
				controls: false,
				showCloseIcon: false,
				download: false
			},
			plugins: [],
			strings: {
				closeGallery: "Close gallery",
				toggleMaximize: "Toggle maximize",
				previousSlide: "Previous slide",
				nextSlide: "Next slide",
				download: "Download",
				playVideo: "Play video"
			}
		};
		function initLgPolyfills() {
			(function () {
				if ("function" === typeof window.CustomEvent) return false;
				function CustomEvent(event, params) {
					params = params || {
						bubbles: false,
						cancelable: false,
						detail: null
					};
					var evt = document.createEvent("CustomEvent");
					evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
					return evt;
				}
				window.CustomEvent = CustomEvent;
			})();
			(function () {
				if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
			})();
		}
		var lgQuery = function () {
			function lgQuery(selector) {
				this.cssVenderPrefixes = ["TransitionDuration", "TransitionTimingFunction", "Transform", "Transition"];
				this.selector = this._getSelector(selector);
				this.firstElement = this._getFirstEl();
				return this;
			}
			lgQuery.generateUUID = function () {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (c) {
					var r = 16 * Math.random() | 0, v = "x" == c ? r : 3 & r | 8;
					return v.toString(16);
				}));
			};
			lgQuery.prototype._getSelector = function (selector, context) {
				if (void 0 === context) context = document;
				if ("string" !== typeof selector) return selector;
				context = context || document;
				var fl = selector.substring(0, 1);
				if ("#" === fl) return context.querySelector(selector); else return context.querySelectorAll(selector);
			};
			lgQuery.prototype._each = function (func) {
				if (!this.selector) return this;
				if (void 0 !== this.selector.length) [].forEach.call(this.selector, func); else func(this.selector, 0);
				return this;
			};
			lgQuery.prototype._setCssVendorPrefix = function (el, cssProperty, value) {
				var property = cssProperty.replace(/-([a-z])/gi, (function (s, group1) {
					return group1.toUpperCase();
				}));
				if (-1 !== this.cssVenderPrefixes.indexOf(property)) {
					el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
					el.style["webkit" + property] = value;
					el.style["moz" + property] = value;
					el.style["ms" + property] = value;
					el.style["o" + property] = value;
				} else el.style[property] = value;
			};
			lgQuery.prototype._getFirstEl = function () {
				if (this.selector && void 0 !== this.selector.length) return this.selector[0]; else return this.selector;
			};
			lgQuery.prototype.isEventMatched = function (event, eventName) {
				var eventNamespace = eventName.split(".");
				return event.split(".").filter((function (e) {
					return e;
				})).every((function (e) {
					return -1 !== eventNamespace.indexOf(e);
				}));
			};
			lgQuery.prototype.attr = function (attr, value) {
				if (void 0 === value) {
					if (!this.firstElement) return "";
					return this.firstElement.getAttribute(attr);
				}
				this._each((function (el) {
					el.setAttribute(attr, value);
				}));
				return this;
			};
			lgQuery.prototype.find = function (selector) {
				return $LG(this._getSelector(selector, this.selector));
			};
			lgQuery.prototype.first = function () {
				if (this.selector && void 0 !== this.selector.length) return $LG(this.selector[0]); else return $LG(this.selector);
			};
			lgQuery.prototype.eq = function (index) {
				return $LG(this.selector[index]);
			};
			lgQuery.prototype.parent = function () {
				return $LG(this.selector.parentElement);
			};
			lgQuery.prototype.get = function () {
				return this._getFirstEl();
			};
			lgQuery.prototype.removeAttr = function (attributes) {
				var attrs = attributes.split(" ");
				this._each((function (el) {
					attrs.forEach((function (attr) {
						return el.removeAttribute(attr);
					}));
				}));
				return this;
			};
			lgQuery.prototype.wrap = function (className) {
				if (!this.firstElement) return this;
				var wrapper = document.createElement("div");
				wrapper.className = className;
				this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
				this.firstElement.parentNode.removeChild(this.firstElement);
				wrapper.appendChild(this.firstElement);
				return this;
			};
			lgQuery.prototype.addClass = function (classNames) {
				if (void 0 === classNames) classNames = "";
				this._each((function (el) {
					classNames.split(" ").forEach((function (className) {
						if (className) el.classList.add(className);
					}));
				}));
				return this;
			};
			lgQuery.prototype.removeClass = function (classNames) {
				this._each((function (el) {
					classNames.split(" ").forEach((function (className) {
						if (className) el.classList.remove(className);
					}));
				}));
				return this;
			};
			lgQuery.prototype.hasClass = function (className) {
				if (!this.firstElement) return false;
				return this.firstElement.classList.contains(className);
			};
			lgQuery.prototype.hasAttribute = function (attribute) {
				if (!this.firstElement) return false;
				return this.firstElement.hasAttribute(attribute);
			};
			lgQuery.prototype.toggleClass = function (className) {
				if (!this.firstElement) return this;
				if (this.hasClass(className)) this.removeClass(className); else this.addClass(className);
				return this;
			};
			lgQuery.prototype.css = function (property, value) {
				var _this = this;
				this._each((function (el) {
					_this._setCssVendorPrefix(el, property, value);
				}));
				return this;
			};
			lgQuery.prototype.on = function (events, listener) {
				var _this = this;
				if (!this.selector) return this;
				events.split(" ").forEach((function (event) {
					if (!Array.isArray(lgQuery.eventListeners[event])) lgQuery.eventListeners[event] = [];
					lgQuery.eventListeners[event].push(listener);
					_this.selector.addEventListener(event.split(".")[0], listener);
				}));
				return this;
			};
			lgQuery.prototype.once = function (event, listener) {
				var _this = this;
				this.on(event, (function () {
					_this.off(event);
					listener(event);
				}));
				return this;
			};
			lgQuery.prototype.off = function (event) {
				var _this = this;
				if (!this.selector) return this;
				Object.keys(lgQuery.eventListeners).forEach((function (eventName) {
					if (_this.isEventMatched(event, eventName)) {
						lgQuery.eventListeners[eventName].forEach((function (listener) {
							_this.selector.removeEventListener(eventName.split(".")[0], listener);
						}));
						lgQuery.eventListeners[eventName] = [];
					}
				}));
				return this;
			};
			lgQuery.prototype.trigger = function (event, detail) {
				if (!this.firstElement) return this;
				var customEvent = new CustomEvent(event.split(".")[0], {
					detail: detail || null
				});
				this.firstElement.dispatchEvent(customEvent);
				return this;
			};
			lgQuery.prototype.load = function (url) {
				var _this = this;
				fetch(url).then((function (res) {
					return res.text();
				})).then((function (html) {
					_this.selector.innerHTML = html;
				}));
				return this;
			};
			lgQuery.prototype.html = function (html) {
				if (void 0 === html) {
					if (!this.firstElement) return "";
					return this.firstElement.innerHTML;
				}
				this._each((function (el) {
					el.innerHTML = html;
				}));
				return this;
			};
			lgQuery.prototype.append = function (html) {
				this._each((function (el) {
					if ("string" === typeof html) el.insertAdjacentHTML("beforeend", html); else el.appendChild(html);
				}));
				return this;
			};
			lgQuery.prototype.prepend = function (html) {
				this._each((function (el) {
					el.insertAdjacentHTML("afterbegin", html);
				}));
				return this;
			};
			lgQuery.prototype.remove = function () {
				this._each((function (el) {
					el.parentNode.removeChild(el);
				}));
				return this;
			};
			lgQuery.prototype.empty = function () {
				this._each((function (el) {
					el.innerHTML = "";
				}));
				return this;
			};
			lgQuery.prototype.scrollTop = function (scrollTop) {
				if (void 0 !== scrollTop) {
					document.body.scrollTop = scrollTop;
					document.documentElement.scrollTop = scrollTop;
					return this;
				} else return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			};
			lgQuery.prototype.scrollLeft = function (scrollLeft) {
				if (void 0 !== scrollLeft) {
					document.body.scrollLeft = scrollLeft;
					document.documentElement.scrollLeft = scrollLeft;
					return this;
				} else return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
			};
			lgQuery.prototype.offset = function () {
				if (!this.firstElement) return {
					left: 0,
					top: 0
				};
				var rect = this.firstElement.getBoundingClientRect();
				var bodyMarginLeft = $LG("body").style().marginLeft;
				return {
					left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
					top: rect.top + this.scrollTop()
				};
			};
			lgQuery.prototype.style = function () {
				if (!this.firstElement) return {};
				return this.firstElement.currentStyle || window.getComputedStyle(this.firstElement);
			};
			lgQuery.prototype.width = function () {
				var style = this.style();
				return this.firstElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			};
			lgQuery.prototype.height = function () {
				var style = this.style();
				return this.firstElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
			};
			lgQuery.eventListeners = {};
			return lgQuery;
		}();
		function $LG(selector) {
			initLgPolyfills();
			return new lgQuery(selector);
		}
		var defaultDynamicOptions = ["src", "sources", "subHtml", "subHtmlUrl", "html", "video", "poster", "slideName", "responsive", "srcset", "sizes", "iframe", "downloadUrl", "download", "width", "facebookShareUrl", "tweetText", "iframeTitle", "twitterShareUrl", "pinterestShareUrl", "pinterestText", "fbHtml", "disqusIdentifier", "disqusUrl"];
		function convertToData(attr) {
			if ("href" === attr) return "src";
			attr = attr.replace("data-", "");
			attr = attr.charAt(0).toLowerCase() + attr.slice(1);
			attr = attr.replace(/-([a-z])/g, (function (g) {
				return g[1].toUpperCase();
			}));
			return attr;
		}
		var utils = {
			getSize: function (el, container, spacing, defaultLgSize) {
				if (void 0 === spacing) spacing = 0;
				var LGel = $LG(el);
				var lgSize = LGel.attr("data-lg-size") || defaultLgSize;
				if (!lgSize) return;
				var isResponsiveSizes = lgSize.split(",");
				if (isResponsiveSizes[1]) {
					var wWidth = window.innerWidth;
					for (var i = 0; i < isResponsiveSizes.length; i++) {
						var size_1 = isResponsiveSizes[i];
						var responsiveWidth = parseInt(size_1.split("-")[2], 10);
						if (responsiveWidth > wWidth) {
							lgSize = size_1;
							break;
						}
						if (i === isResponsiveSizes.length - 1) lgSize = size_1;
					}
				}
				var size = lgSize.split("-");
				var width = parseInt(size[0], 10);
				var height = parseInt(size[1], 10);
				var cWidth = container.width();
				var cHeight = container.height() - spacing;
				var maxWidth = Math.min(cWidth, width);
				var maxHeight = Math.min(cHeight, height);
				var ratio = Math.min(maxWidth / width, maxHeight / height);
				return {
					width: width * ratio,
					height: height * ratio
				};
			},
			getTransform: function (el, container, top, bottom, imageSize) {
				if (!imageSize) return;
				var LGel = $LG(el).find("img").first();
				if (!LGel.get()) return;
				var containerRect = container.get().getBoundingClientRect();
				var wWidth = containerRect.width;
				var wHeight = container.height() - (top + bottom);
				var elWidth = LGel.width();
				var elHeight = LGel.height();
				var elStyle = LGel.style();
				var x = (wWidth - elWidth) / 2 - LGel.offset().left + (parseFloat(elStyle.paddingLeft) || 0) + (parseFloat(elStyle.borderLeft) || 0) + $LG(window).scrollLeft() + containerRect.left;
				var y = (wHeight - elHeight) / 2 - LGel.offset().top + (parseFloat(elStyle.paddingTop) || 0) + (parseFloat(elStyle.borderTop) || 0) + $LG(window).scrollTop() + top;
				var scX = elWidth / imageSize.width;
				var scY = elHeight / imageSize.height;
				var transform = "translate3d(" + (x *= -1) + "px, " + (y *= -1) + "px, 0) scale3d(" + scX + ", " + scY + ", 1)";
				return transform;
			},
			getIframeMarkup: function (iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
				var title = iframeTitle ? 'title="' + iframeTitle + '"' : "";
				return '<div class="lg-video-cont lg-has-iframe" style="width:' + iframeWidth + "; max-width:" + iframeMaxWidth + "; height: " + iframeHeight + "; max-height:" + iframeMaxHeight + '">\n                    <iframe class="lg-object" frameborder="0" ' + title + ' src="' + src + '"  allowfullscreen="true"></iframe>\n                </div>';
			},
			getImgMarkup: function (index, src, altAttr, srcset, sizes, sources) {
				var srcsetAttr = srcset ? 'srcset="' + srcset + '"' : "";
				var sizesAttr = sizes ? 'sizes="' + sizes + '"' : "";
				var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + ' class="lg-object lg-image" data-index="' + index + '" src="' + src + '" />';
				var sourceTag = "";
				if (sources) {
					var sourceObj = "string" === typeof sources ? JSON.parse(sources) : sources;
					sourceTag = sourceObj.map((function (source) {
						var attrs = "";
						Object.keys(source).forEach((function (key) {
							attrs += " " + key + '="' + source[key] + '"';
						}));
						return "<source " + attrs + "></source>";
					}));
				}
				return "" + sourceTag + imgMarkup;
			},
			getResponsiveSrc: function (srcItms) {
				var rsWidth = [];
				var rsSrc = [];
				var src = "";
				for (var i = 0; i < srcItms.length; i++) {
					var _src = srcItms[i].split(" ");
					if ("" === _src[0]) _src.splice(0, 1);
					rsSrc.push(_src[0]);
					rsWidth.push(_src[1]);
				}
				var wWidth = window.innerWidth;
				for (var j = 0; j < rsWidth.length; j++) if (parseInt(rsWidth[j], 10) > wWidth) {
					src = rsSrc[j];
					break;
				}
				return src;
			},
			isImageLoaded: function (img) {
				if (!img) return false;
				if (!img.complete) return false;
				if (0 === img.naturalWidth) return false;
				return true;
			},
			getVideoPosterMarkup: function (_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
				var videoClass = "";
				if (_isVideo && _isVideo.youtube) videoClass = "lg-has-youtube"; else if (_isVideo && _isVideo.vimeo) videoClass = "lg-has-vimeo"; else videoClass = "lg-has-html5";
				return '<div class="lg-video-cont ' + videoClass + '" style="' + videoContStyle + '">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="' + playVideoString + '"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>' + playVideoString + '</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            ' + (dummyImg || "") + '\n            <img class="lg-object lg-video-poster" src="' + _poster + '" />\n        </div>';
			},
			getFocusableElements: function (container) {
				var elements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
				var visibleElements = [].filter.call(elements, (function (element) {
					var style = window.getComputedStyle(element);
					return "none" !== style.display && "hidden" !== style.visibility;
				}));
				return visibleElements;
			},
			getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
				var dynamicElements = [];
				var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
				[].forEach.call(items, (function (item) {
					var dynamicEl = {};
					for (var i = 0; i < item.attributes.length; i++) {
						var attr = item.attributes[i];
						if (attr.specified) {
							var dynamicAttr = convertToData(attr.name);
							var label = "";
							if (availableDynamicOptions.indexOf(dynamicAttr) > -1) label = dynamicAttr;
							if (label) dynamicEl[label] = attr.value;
						}
					}
					var currentItem = $LG(item);
					var alt = currentItem.find("img").first().attr("alt");
					var title = currentItem.attr("title");
					var thumb = exThumbImage ? currentItem.attr(exThumbImage) : currentItem.find("img").first().attr("src");
					dynamicEl.thumb = thumb;
					if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) dynamicEl.subHtml = title || alt || "";
					dynamicEl.alt = alt || title || "";
					dynamicElements.push(dynamicEl);
				}));
				return dynamicElements;
			},
			isMobile: function () {
				return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			},
			isVideo: function (src, isHTML5VIdeo, index) {
				if (!src) if (isHTML5VIdeo) return {
					html5: true
				}; else {
					console.error("lightGallery :- data-src is not provided on slide item " + (index + 1) + ". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/");
					return;
				}
				var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i);
				var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i);
				var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
				if (youtube) return {
					youtube
				}; else if (vimeo) return {
					vimeo
				}; else if (wistia) return {
					wistia
				};
			}
		};
		var lgId = 0;
		var LightGallery = function () {
			function LightGallery(element, options) {
				this.lgOpened = false;
				this.index = 0;
				this.plugins = [];
				this.lGalleryOn = false;
				this.lgBusy = false;
				this.currentItemsInDom = [];
				this.prevScrollTop = 0;
				this.bodyPaddingRight = 0;
				this.isDummyImageRemoved = false;
				this.dragOrSwipeEnabled = false;
				this.mediaContainerPosition = {
					top: 0,
					bottom: 0
				};
				if (!element) return this;
				lgId++;
				this.lgId = lgId;
				this.el = element;
				this.LGel = $LG(element);
				this.generateSettings(options);
				this.buildModules();
				if (this.settings.dynamic && void 0 !== this.settings.dynamicEl && !Array.isArray(this.settings.dynamicEl)) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
				this.galleryItems = this.getItems();
				this.normalizeSettings();
				this.init();
				this.validateLicense();
				return this;
			}
			LightGallery.prototype.generateSettings = function (options) {
				this.settings = __assign(__assign({}, lightGalleryCoreSettings), options);
				if (this.settings.isMobile && "function" === typeof this.settings.isMobile ? this.settings.isMobile() : utils.isMobile()) {
					var mobileSettings = __assign(__assign({}, this.settings.mobileSettings), this.settings.mobileSettings);
					this.settings = __assign(__assign({}, this.settings), mobileSettings);
				}
			};
			LightGallery.prototype.normalizeSettings = function () {
				if (this.settings.slideEndAnimation) this.settings.hideControlOnEnd = false;
				if (!this.settings.closable) this.settings.swipeToClose = false;
				this.zoomFromOrigin = this.settings.zoomFromOrigin;
				if (this.settings.dynamic) this.zoomFromOrigin = false;
				if (!this.settings.container) this.settings.container = document.body;
				this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
			};
			LightGallery.prototype.init = function () {
				var _this = this;
				this.addSlideVideoInfo(this.galleryItems);
				this.buildStructure();
				this.LGel.trigger(lGEvents.init, {
					instance: this
				});
				if (this.settings.keyPress) this.keyPress();
				setTimeout((function () {
					_this.enableDrag();
					_this.enableSwipe();
					_this.triggerPosterClick();
				}), 50);
				this.arrow();
				if (this.settings.mousewheel) this.mousewheel();
				if (!this.settings.dynamic) this.openGalleryOnItemClick();
			};
			LightGallery.prototype.openGalleryOnItemClick = function () {
				var _this = this;
				var _loop_1 = function (index) {
					var element = this_1.items[index];
					var $element = $LG(element);
					var uuid = lgQuery.generateUUID();
					$element.attr("data-lg-id", uuid).on("click.lgcustom-item-" + uuid, (function (e) {
						e.preventDefault();
						var currentItemIndex = _this.settings.index || index;
						_this.openGallery(currentItemIndex, element);
					}));
				};
				var this_1 = this;
				for (var index = 0; index < this.items.length; index++) _loop_1(index);
			};
			LightGallery.prototype.buildModules = function () {
				var _this = this;
				this.settings.plugins.forEach((function (plugin) {
					_this.plugins.push(new plugin(_this, $LG));
				}));
			};
			LightGallery.prototype.validateLicense = function () {
				if (!this.settings.licenseKey) console.error("Please provide a valid license key"); else if ("0000-0000-000-0000" === this.settings.licenseKey) console.warn("lightGallery: " + this.settings.licenseKey + " license key is not valid for production use");
			};
			LightGallery.prototype.getSlideItem = function (index) {
				return $LG(this.getSlideItemId(index));
			};
			LightGallery.prototype.getSlideItemId = function (index) {
				return "#lg-item-" + this.lgId + "-" + index;
			};
			LightGallery.prototype.getIdName = function (id) {
				return id + "-" + this.lgId;
			};
			LightGallery.prototype.getElementById = function (id) {
				return $LG("#" + this.getIdName(id));
			};
			LightGallery.prototype.manageSingleSlideClassName = function () {
				if (this.galleryItems.length < 2) this.outer.addClass("lg-single-item"); else this.outer.removeClass("lg-single-item");
			};
			LightGallery.prototype.buildStructure = function () {
				var _this = this;
				var container = this.$container && this.$container.get();
				if (container) return;
				var controls = "";
				var subHtmlCont = "";
				if (this.settings.controls) controls = '<button type="button" id="' + this.getIdName("lg-prev") + '" aria-label="' + this.settings.strings["previousSlide"] + '" class="lg-prev lg-icon"> ' + this.settings.prevHtml + ' </button>\n                <button type="button" id="' + this.getIdName("lg-next") + '" aria-label="' + this.settings.strings["nextSlide"] + '" class="lg-next lg-icon"> ' + this.settings.nextHtml + " </button>";
				if (".lg-item" !== this.settings.appendSubHtmlTo) subHtmlCont = '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
				var addClasses = "";
				if (this.settings.allowMediaOverlap) addClasses += "lg-media-overlap ";
				var ariaLabelledby = this.settings.ariaLabelledby ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"' : "";
				var ariaDescribedby = this.settings.ariaDescribedby ? 'aria-describedby="' + this.settings.ariaDescribedby + '"' : "";
				var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? "lg-inline" : "");
				var closeIcon = this.settings.closable && this.settings.showCloseIcon ? '<button type="button" aria-label="' + this.settings.strings["closeGallery"] + '" id="' + this.getIdName("lg-close") + '" class="lg-close lg-icon"></button>' : "";
				var maximizeIcon = this.settings.showMaximizeIcon ? '<button type="button" aria-label="' + this.settings.strings["toggleMaximize"] + '" id="' + this.getIdName("lg-maximize") + '" class="lg-maximize lg-icon"></button>' : "";
				var template = '\n        <div class="' + containerClassName + '" id="' + this.getIdName("lg-container") + '" tabindex="-1" aria-modal="true" ' + ariaLabelledby + " " + ariaDescribedby + ' role="dialog"\n        >\n            <div id="' + this.getIdName("lg-backdrop") + '" class="lg-backdrop"></div>\n\n            <div id="' + this.getIdName("lg-outer") + '" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ' + addClasses + ' ">\n\n              <div id="' + this.getIdName("lg-content") + '" class="lg-content">\n                <div id="' + this.getIdName("lg-inner") + '" class="lg-inner">\n                </div>\n                ' + controls + '\n              </div>\n                <div id="' + this.getIdName("lg-toolbar") + '" class="lg-toolbar lg-group">\n                    ' + maximizeIcon + "\n                    " + closeIcon + "\n                    </div>\n                    " + (".lg-outer" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + '\n                <div id="' + this.getIdName("lg-components") + '" class="lg-components">\n                    ' + (".lg-sub-html" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + "\n                </div>\n            </div>\n        </div>\n        ";
				$LG(this.settings.container).append(template);
				if (document.body !== this.settings.container) $LG(this.settings.container).css("position", "relative");
				this.outer = this.getElementById("lg-outer");
				this.$lgComponents = this.getElementById("lg-components");
				this.$backdrop = this.getElementById("lg-backdrop");
				this.$container = this.getElementById("lg-container");
				this.$inner = this.getElementById("lg-inner");
				this.$content = this.getElementById("lg-content");
				this.$toolbar = this.getElementById("lg-toolbar");
				this.$backdrop.css("transition-duration", this.settings.backdropDuration + "ms");
				var outerClassNames = this.settings.mode + " ";
				this.manageSingleSlideClassName();
				if (this.settings.enableDrag) outerClassNames += "lg-grab ";
				this.outer.addClass(outerClassNames);
				this.$inner.css("transition-timing-function", this.settings.easing);
				this.$inner.css("transition-duration", this.settings.speed + "ms");
				if (this.settings.download) this.$toolbar.append('<a id="' + this.getIdName("lg-download") + '" target="_blank" rel="noopener" aria-label="' + this.settings.strings["download"] + '" download class="lg-download lg-icon"></a>');
				this.counter();
				$LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, (function () {
					_this.refreshOnResize();
				}));
				this.hideBars();
				this.manageCloseGallery();
				this.toggleMaximize();
				this.initModules();
			};
			LightGallery.prototype.refreshOnResize = function () {
				if (this.lgOpened) {
					var currentGalleryItem = this.galleryItems[this.index];
					var __slideVideoInfo = currentGalleryItem.__slideVideoInfo;
					this.mediaContainerPosition = this.getMediaContainerPosition();
					var _a = this.mediaContainerPosition, top_1 = _a.top, bottom = _a.bottom;
					this.currentImageSize = utils.getSize(this.items[this.index], this.outer, top_1 + bottom, __slideVideoInfo && this.settings.videoMaxSize);
					if (__slideVideoInfo) this.resizeVideoSlide(this.index, this.currentImageSize);
					if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
						var imgStyle = this.getDummyImgStyles(this.currentImageSize);
						this.outer.find(".lg-current .lg-dummy-img").first().attr("style", imgStyle);
					}
					this.LGel.trigger(lGEvents.containerResize);
				}
			};
			LightGallery.prototype.resizeVideoSlide = function (index, imageSize) {
				var lgVideoStyle = this.getVideoContStyle(imageSize);
				var currentSlide = this.getSlideItem(index);
				currentSlide.find(".lg-video-cont").attr("style", lgVideoStyle);
			};
			LightGallery.prototype.updateSlides = function (items, index) {
				if (this.index > items.length - 1) this.index = items.length - 1;
				if (1 === items.length) this.index = 0;
				if (!items.length) {
					this.closeGallery();
					return;
				}
				var currentSrc = this.galleryItems[index].src;
				this.galleryItems = items;
				this.updateControls();
				this.$inner.empty();
				this.currentItemsInDom = [];
				var _index = 0;
				this.galleryItems.some((function (galleryItem, itemIndex) {
					if (galleryItem.src === currentSrc) {
						_index = itemIndex;
						return true;
					}
					return false;
				}));
				this.currentItemsInDom = this.organizeSlideItems(_index, -1);
				this.loadContent(_index, true);
				this.getSlideItem(_index).addClass("lg-current");
				this.index = _index;
				this.updateCurrentCounter(_index);
				this.LGel.trigger(lGEvents.updateSlides);
			};
			LightGallery.prototype.getItems = function () {
				this.items = [];
				if (!this.settings.dynamic) {
					if ("this" === this.settings.selector) this.items.push(this.el); else if (this.settings.selector) if ("string" === typeof this.settings.selector) if (this.settings.selectWithin) {
						var selectWithin = $LG(this.settings.selectWithin);
						this.items = selectWithin.find(this.settings.selector).get();
					} else this.items = this.el.querySelectorAll(this.settings.selector); else this.items = this.settings.selector; else this.items = this.el.children;
					return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
				} else return this.settings.dynamicEl || [];
			};
			LightGallery.prototype.shouldHideScrollbar = function () {
				return this.settings.hideScrollbar && document.body === this.settings.container;
			};
			LightGallery.prototype.hideScrollbar = function () {
				if (!this.shouldHideScrollbar()) return;
				this.bodyPaddingRight = parseFloat($LG("body").style().paddingRight);
				var bodyRect = document.documentElement.getBoundingClientRect();
				var scrollbarWidth = window.innerWidth - bodyRect.width;
				$LG(document.body).css("padding-right", scrollbarWidth + this.bodyPaddingRight + "px");
				$LG(document.body).addClass("lg-overlay-open");
			};
			LightGallery.prototype.resetScrollBar = function () {
				if (!this.shouldHideScrollbar()) return;
				$LG(document.body).css("padding-right", this.bodyPaddingRight + "px");
				$LG(document.body).removeClass("lg-overlay-open");
			};
			LightGallery.prototype.openGallery = function (index, element) {
				var _this = this;
				if (void 0 === index) index = this.settings.index;
				if (this.lgOpened) return;
				this.lgOpened = true;
				this.outer.removeClass("lg-hide-items");
				this.hideScrollbar();
				this.$container.addClass("lg-show");
				var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
				this.currentItemsInDom = itemsToBeInsertedToDom;
				var items = "";
				itemsToBeInsertedToDom.forEach((function (item) {
					items = items + '<div id="' + item + '" class="lg-item"></div>';
				}));
				this.$inner.append(items);
				this.addHtml(index);
				var transform = "";
				this.mediaContainerPosition = this.getMediaContainerPosition();
				var _a = this.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
				if (!this.settings.allowMediaOverlap) this.setMediaContainerPosition(top, bottom);
				var __slideVideoInfo = this.galleryItems[index].__slideVideoInfo;
				if (this.zoomFromOrigin && element) {
					this.currentImageSize = utils.getSize(element, this.outer, top + bottom, __slideVideoInfo && this.settings.videoMaxSize);
					transform = utils.getTransform(element, this.outer, top, bottom, this.currentImageSize);
				}
				if (!this.zoomFromOrigin || !transform) {
					this.outer.addClass(this.settings.startClass);
					this.getSlideItem(index).removeClass("lg-complete");
				}
				var timeout = this.settings.zoomFromOrigin ? 100 : this.settings.backdropDuration;
				setTimeout((function () {
					_this.outer.addClass("lg-components-open");
				}), timeout);
				this.index = index;
				this.LGel.trigger(lGEvents.beforeOpen);
				this.getSlideItem(index).addClass("lg-current");
				this.lGalleryOn = false;
				this.prevScrollTop = $LG(window).scrollTop();
				setTimeout((function () {
					if (_this.zoomFromOrigin && transform) {
						var currentSlide_1 = _this.getSlideItem(index);
						currentSlide_1.css("transform", transform);
						setTimeout((function () {
							currentSlide_1.addClass("lg-start-progress lg-start-end-progress").css("transition-duration", _this.settings.startAnimationDuration + "ms");
							_this.outer.addClass("lg-zoom-from-image");
						}));
						setTimeout((function () {
							currentSlide_1.css("transform", "translate3d(0, 0, 0)");
						}), 100);
					}
					setTimeout((function () {
						_this.$backdrop.addClass("in");
						_this.$container.addClass("lg-show-in");
					}), 10);
					setTimeout((function () {
						if (_this.settings.trapFocus && document.body === _this.settings.container) _this.trapFocus();
					}), _this.settings.backdropDuration + 50);
					if (!_this.zoomFromOrigin || !transform) setTimeout((function () {
						_this.outer.addClass("lg-visible");
					}), _this.settings.backdropDuration);
					_this.slide(index, false, false, false);
					_this.LGel.trigger(lGEvents.afterOpen);
				}));
				if (document.body === this.settings.container) $LG("html").addClass("lg-on");
			};
			LightGallery.prototype.getMediaContainerPosition = function () {
				if (this.settings.allowMediaOverlap) return {
					top: 0,
					bottom: 0
				};
				var top = this.$toolbar.get().clientHeight || 0;
				var subHtml = this.outer.find(".lg-components .lg-sub-html").get();
				var captionHeight = this.settings.defaultCaptionHeight || subHtml && subHtml.clientHeight || 0;
				var thumbContainer = this.outer.find(".lg-thumb-outer").get();
				var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
				var bottom = thumbHeight + captionHeight;
				return {
					top,
					bottom
				};
			};
			LightGallery.prototype.setMediaContainerPosition = function (top, bottom) {
				if (void 0 === top) top = 0;
				if (void 0 === bottom) bottom = 0;
				this.$content.css("top", top + "px").css("bottom", bottom + "px");
			};
			LightGallery.prototype.hideBars = function () {
				var _this = this;
				setTimeout((function () {
					_this.outer.removeClass("lg-hide-items");
					if (_this.settings.hideBarsDelay > 0) {
						_this.outer.on("mousemove.lg click.lg touchstart.lg", (function () {
							_this.outer.removeClass("lg-hide-items");
							clearTimeout(_this.hideBarTimeout);
							_this.hideBarTimeout = setTimeout((function () {
								_this.outer.addClass("lg-hide-items");
							}), _this.settings.hideBarsDelay);
						}));
						_this.outer.trigger("mousemove.lg");
					}
				}), this.settings.showBarsAfter);
			};
			LightGallery.prototype.initPictureFill = function ($img) {
				if (this.settings.supportLegacyBrowser) try {
					picturefill({
						elements: [$img.get()]
					});
				} catch (e) {
					console.warn("lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.");
				}
			};
			LightGallery.prototype.counter = function () {
				if (this.settings.counter) {
					var counterHtml = '<div class="lg-counter" role="status" aria-live="polite">\n                <span id="' + this.getIdName("lg-counter-current") + '" class="lg-counter-current">' + (this.index + 1) + ' </span> /\n                <span id="' + this.getIdName("lg-counter-all") + '" class="lg-counter-all">' + this.galleryItems.length + " </span></div>";
					this.outer.find(this.settings.appendCounterTo).append(counterHtml);
				}
			};
			LightGallery.prototype.addHtml = function (index) {
				var subHtml;
				var subHtmlUrl;
				if (this.galleryItems[index].subHtmlUrl) subHtmlUrl = this.galleryItems[index].subHtmlUrl; else subHtml = this.galleryItems[index].subHtml;
				if (!subHtmlUrl) if (subHtml) {
					var fL = subHtml.substring(0, 1);
					if ("." === fL || "#" === fL) if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) subHtml = $LG(this.items).eq(index).find(subHtml).first().html(); else subHtml = $LG(subHtml).first().html();
				} else subHtml = "";
				if (".lg-item" !== this.settings.appendSubHtmlTo) if (subHtmlUrl) this.outer.find(".lg-sub-html").load(subHtmlUrl); else this.outer.find(".lg-sub-html").html(subHtml); else {
					var currentSlide = $LG(this.getSlideItemId(index));
					if (subHtmlUrl) currentSlide.load(subHtmlUrl); else currentSlide.append('<div class="lg-sub-html">' + subHtml + "</div>");
				}
				if ("undefined" !== typeof subHtml && null !== subHtml) if ("" === subHtml) this.outer.find(this.settings.appendSubHtmlTo).addClass("lg-empty-html"); else this.outer.find(this.settings.appendSubHtmlTo).removeClass("lg-empty-html");
				this.LGel.trigger(lGEvents.afterAppendSubHtml, {
					index
				});
			};
			LightGallery.prototype.preload = function (index) {
				for (var i = 1; i <= this.settings.preload; i++) {
					if (i >= this.galleryItems.length - index) break;
					this.loadContent(index + i, false);
				}
				for (var j = 1; j <= this.settings.preload; j++) {
					if (index - j < 0) break;
					this.loadContent(index - j, false);
				}
			};
			LightGallery.prototype.getDummyImgStyles = function (imageSize) {
				if (!imageSize) return "";
				return "width:" + imageSize.width + "px;\n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px;\n                height:" + imageSize.height + "px";
			};
			LightGallery.prototype.getVideoContStyle = function (imageSize) {
				if (!imageSize) return "";
				return "width:" + imageSize.width + "px;\n                height:" + imageSize.height + "px";
			};
			LightGallery.prototype.getDummyImageContent = function ($currentSlide, index, alt) {
				var $currentItem;
				if (!this.settings.dynamic) $currentItem = $LG(this.items).eq(index);
				if ($currentItem) {
					var _dummyImgSrc = void 0;
					if (!this.settings.exThumbImage) _dummyImgSrc = $currentItem.find("img").first().attr("src"); else _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
					if (!_dummyImgSrc) return "";
					var imgStyle = this.getDummyImgStyles(this.currentImageSize);
					var dummyImgContent = "<img " + alt + ' style="' + imgStyle + '" class="lg-dummy-img" src="' + _dummyImgSrc + '" />';
					$currentSlide.addClass("lg-first-slide");
					this.outer.addClass("lg-first-slide-loading");
					return dummyImgContent;
				}
				return "";
			};
			LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
				var currentGalleryItem = this.galleryItems[index];
				var alt = currentGalleryItem.alt, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
				var imgContent = "";
				var altAttr = alt ? 'alt="' + alt + '"' : "";
				if (this.isFirstSlideWithZoomAnimation()) imgContent = this.getDummyImageContent($currentSlide, index, altAttr); else imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
				var imgMarkup = '<picture class="lg-img-wrap"> ' + imgContent + "</picture>";
				$currentSlide.prepend(imgMarkup);
			};
			LightGallery.prototype.onSlideObjectLoad = function ($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
				var mediaObject = $slide.find(".lg-object").first();
				if (utils.isImageLoaded(mediaObject.get()) || isHTML5VideoWithoutPoster) onLoad(); else {
					mediaObject.on("load.lg error.lg", (function () {
						onLoad && onLoad();
					}));
					mediaObject.on("error.lg", (function () {
						onError && onError();
					}));
				}
			};
			LightGallery.prototype.onLgObjectLoad = function (currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
				var _this = this;
				this.onSlideObjectLoad(currentSlide, isHTML5VideoWithoutPoster, (function () {
					_this.triggerSlideItemLoad(currentSlide, index, delay, speed, isFirstSlide);
				}), (function () {
					currentSlide.addClass("lg-complete lg-complete_");
					currentSlide.html('<span class="lg-error-msg">Oops... Failed to load content...</span>');
				}));
			};
			LightGallery.prototype.triggerSlideItemLoad = function ($currentSlide, index, delay, speed, isFirstSlide) {
				var _this = this;
				var currentGalleryItem = this.galleryItems[index];
				var _speed = isFirstSlide && "video" === this.getSlideType(currentGalleryItem) && !currentGalleryItem.poster ? speed : 0;
				setTimeout((function () {
					$currentSlide.addClass("lg-complete lg-complete_");
					_this.LGel.trigger(lGEvents.slideItemLoad, {
						index,
						delay: delay || 0,
						isFirstSlide
					});
				}), _speed);
			};
			LightGallery.prototype.isFirstSlideWithZoomAnimation = function () {
				return !!(!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize);
			};
			LightGallery.prototype.addSlideVideoInfo = function (items) {
				var _this = this;
				items.forEach((function (element, index) {
					element.__slideVideoInfo = utils.isVideo(element.src, !!element.video, index);
					if (element.__slideVideoInfo && _this.settings.loadYouTubePoster && !element.poster && element.__slideVideoInfo.youtube) element.poster = "//img.youtube.com/vi/" + element.__slideVideoInfo.youtube[1] + "/maxresdefault.jpg";
				}));
			};
			LightGallery.prototype.loadContent = function (index, rec) {
				var _this = this;
				var currentGalleryItem = this.galleryItems[index];
				var $currentSlide = $LG(this.getSlideItemId(index));
				var poster = currentGalleryItem.poster, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
				var src = currentGalleryItem.src;
				var video = currentGalleryItem.video;
				var _html5Video = video && "string" === typeof video ? JSON.parse(video) : video;
				if (currentGalleryItem.responsive) {
					var srcDyItms = currentGalleryItem.responsive.split(",");
					src = utils.getResponsiveSrc(srcDyItms) || src;
				}
				var videoInfo = currentGalleryItem.__slideVideoInfo;
				var lgVideoStyle = "";
				var iframe = !!currentGalleryItem.iframe;
				var isFirstSlide = !this.lGalleryOn;
				var delay = 0;
				if (isFirstSlide) if (this.zoomFromOrigin && this.currentImageSize) delay = this.settings.startAnimationDuration + 10; else delay = this.settings.backdropDuration + 10;
				if (!$currentSlide.hasClass("lg-loaded")) {
					if (videoInfo) {
						var _a = this.mediaContainerPosition, top_2 = _a.top, bottom = _a.bottom;
						var videoSize = utils.getSize(this.items[index], this.outer, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
						lgVideoStyle = this.getVideoContStyle(videoSize);
					}
					if (iframe) {
						var markup = utils.getIframeMarkup(this.settings.iframeWidth, this.settings.iframeHeight, this.settings.iframeMaxWidth, this.settings.iframeMaxHeight, src, currentGalleryItem.iframeTitle);
						$currentSlide.prepend(markup);
					} else if (poster) {
						var dummyImg = "";
						var hasStartAnimation = isFirstSlide && this.zoomFromOrigin && this.currentImageSize;
						if (hasStartAnimation) dummyImg = this.getDummyImageContent($currentSlide, index, "");
						markup = utils.getVideoPosterMarkup(poster, dummyImg || "", lgVideoStyle, this.settings.strings["playVideo"], videoInfo);
						$currentSlide.prepend(markup);
					} else if (videoInfo) {
						markup = '<div class="lg-video-cont " style="' + lgVideoStyle + '"></div>';
						$currentSlide.prepend(markup);
					} else {
						this.setImgMarkup(src, $currentSlide, index);
						if (srcset || sources) {
							var $img = $currentSlide.find(".lg-object");
							this.initPictureFill($img);
						}
					}
					if (poster || videoInfo) this.LGel.trigger(lGEvents.hasVideo, {
						index,
						src,
						html5Video: _html5Video,
						hasPoster: !!poster
					});
					this.LGel.trigger(lGEvents.afterAppendSlide, {
						index
					});
					if (this.lGalleryOn && ".lg-item" === this.settings.appendSubHtmlTo) this.addHtml(index);
				}
				var _speed = 0;
				if (delay && !$LG(document.body).hasClass("lg-from-hash")) _speed = delay;
				if (this.isFirstSlideWithZoomAnimation()) {
					setTimeout((function () {
						$currentSlide.removeClass("lg-start-end-progress lg-start-progress").removeAttr("style");
					}), this.settings.startAnimationDuration + 100);
					if (!$currentSlide.hasClass("lg-loaded")) setTimeout((function () {
						if ("image" === _this.getSlideType(currentGalleryItem)) {
							var alt = currentGalleryItem.alt;
							var altAttr = alt ? 'alt="' + alt + '"' : "";
							$currentSlide.find(".lg-img-wrap").append(utils.getImgMarkup(index, src, altAttr, srcset, sizes, currentGalleryItem.sources));
							if (srcset || sources) {
								var $img = $currentSlide.find(".lg-object");
								_this.initPictureFill($img);
							}
						}
						if ("image" === _this.getSlideType(currentGalleryItem) || "video" === _this.getSlideType(currentGalleryItem) && poster) {
							_this.onLgObjectLoad($currentSlide, index, delay, _speed, true, false);
							_this.onSlideObjectLoad($currentSlide, !!(videoInfo && videoInfo.html5 && !poster), (function () {
								_this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
							}), (function () {
								_this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
							}));
						}
					}), this.settings.startAnimationDuration + 100);
				}
				$currentSlide.addClass("lg-loaded");
				if (!this.isFirstSlideWithZoomAnimation() || "video" === this.getSlideType(currentGalleryItem) && !poster) this.onLgObjectLoad($currentSlide, index, delay, _speed, isFirstSlide, !!(videoInfo && videoInfo.html5 && !poster));
				if ((!this.zoomFromOrigin || !this.currentImageSize) && $currentSlide.hasClass("lg-complete_") && !this.lGalleryOn) setTimeout((function () {
					$currentSlide.addClass("lg-complete");
				}), this.settings.backdropDuration);
				this.lGalleryOn = true;
				if (true === rec) if (!$currentSlide.hasClass("lg-complete_")) $currentSlide.find(".lg-object").first().on("load.lg error.lg", (function () {
					_this.preload(index);
				})); else this.preload(index);
			};
			LightGallery.prototype.loadContentOnFirstSlideLoad = function (index, $currentSlide, speed) {
				var _this = this;
				setTimeout((function () {
					$currentSlide.find(".lg-dummy-img").remove();
					$currentSlide.removeClass("lg-first-slide");
					_this.outer.removeClass("lg-first-slide-loading");
					_this.isDummyImageRemoved = true;
					_this.preload(index);
				}), speed + 300);
			};
			LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
				var _this = this;
				if (void 0 === numberOfItems) numberOfItems = 0;
				var itemsToBeInsertedToDom = [];
				var possibleNumberOfItems = Math.max(numberOfItems, 3);
				possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
				var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
				if (this.galleryItems.length <= 3) {
					this.galleryItems.forEach((function (_element, index) {
						itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
					}));
					return itemsToBeInsertedToDom;
				}
				if (index < (this.galleryItems.length - 1) / 2) {
					for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
					var numberOfExistingItems = itemsToBeInsertedToDom.length;
					for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
				} else {
					for (idx = index; idx <= this.galleryItems.length - 1 && idx < index + possibleNumberOfItems / 2; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
					numberOfExistingItems = itemsToBeInsertedToDom.length;
					for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
				}
				if (this.settings.loop) if (index === this.galleryItems.length - 1) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0); else if (0 === index) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
				if (-1 === itemsToBeInsertedToDom.indexOf(prevIndexItem)) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
				return itemsToBeInsertedToDom;
			};
			LightGallery.prototype.organizeSlideItems = function (index, prevIndex) {
				var _this = this;
				var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
				itemsToBeInsertedToDom.forEach((function (item) {
					if (-1 === _this.currentItemsInDom.indexOf(item)) _this.$inner.append('<div id="' + item + '" class="lg-item"></div>');
				}));
				this.currentItemsInDom.forEach((function (item) {
					if (-1 === itemsToBeInsertedToDom.indexOf(item)) $LG("#" + item).remove();
				}));
				return itemsToBeInsertedToDom;
			};
			LightGallery.prototype.getPreviousSlideIndex = function () {
				var prevIndex = 0;
				try {
					var currentItemId = this.outer.find(".lg-current").first().attr("id");
					prevIndex = parseInt(currentItemId.split("-")[3]) || 0;
				} catch (error) {
					prevIndex = 0;
				}
				return prevIndex;
			};
			LightGallery.prototype.setDownloadValue = function (index) {
				if (this.settings.download) {
					var currentGalleryItem = this.galleryItems[index];
					var hideDownloadBtn = false === currentGalleryItem.downloadUrl || "false" === currentGalleryItem.downloadUrl;
					if (hideDownloadBtn) this.outer.addClass("lg-hide-download"); else {
						var $download = this.getElementById("lg-download");
						this.outer.removeClass("lg-hide-download");
						$download.attr("href", currentGalleryItem.downloadUrl || currentGalleryItem.src);
						if (currentGalleryItem.download) $download.attr("download", currentGalleryItem.download);
					}
				}
			};
			LightGallery.prototype.makeSlideAnimation = function (direction, currentSlideItem, previousSlideItem) {
				var _this = this;
				if (this.lGalleryOn) previousSlideItem.addClass("lg-slide-progress");
				setTimeout((function () {
					_this.outer.addClass("lg-no-trans");
					_this.outer.find(".lg-item").removeClass("lg-prev-slide lg-next-slide");
					if ("prev" === direction) {
						currentSlideItem.addClass("lg-prev-slide");
						previousSlideItem.addClass("lg-next-slide");
					} else {
						currentSlideItem.addClass("lg-next-slide");
						previousSlideItem.addClass("lg-prev-slide");
					}
					setTimeout((function () {
						_this.outer.find(".lg-item").removeClass("lg-current");
						currentSlideItem.addClass("lg-current");
						_this.outer.removeClass("lg-no-trans");
					}), 50);
				}), this.lGalleryOn ? this.settings.slideDelay : 0);
			};
			LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
				var _this = this;
				var prevIndex = this.getPreviousSlideIndex();
				this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
				if (this.lGalleryOn && prevIndex === index) return;
				var numberOfGalleryItems = this.galleryItems.length;
				if (!this.lgBusy) {
					if (this.settings.counter) this.updateCurrentCounter(index);
					var currentSlideItem = this.getSlideItem(index);
					var previousSlideItem_1 = this.getSlideItem(prevIndex);
					var currentGalleryItem = this.galleryItems[index];
					var videoInfo = currentGalleryItem.__slideVideoInfo;
					this.outer.attr("data-lg-slide-type", this.getSlideType(currentGalleryItem));
					this.setDownloadValue(index);
					if (videoInfo) {
						var _a = this.mediaContainerPosition, top_3 = _a.top, bottom = _a.bottom;
						var videoSize = utils.getSize(this.items[index], this.outer, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
						this.resizeVideoSlide(index, videoSize);
					}
					this.LGel.trigger(lGEvents.beforeSlide, {
						prevIndex,
						index,
						fromTouch: !!fromTouch,
						fromThumb: !!fromThumb
					});
					this.lgBusy = true;
					clearTimeout(this.hideBarTimeout);
					this.arrowDisable(index);
					if (!direction) if (index < prevIndex) direction = "prev"; else if (index > prevIndex) direction = "next";
					if (!fromTouch) this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1); else {
						this.outer.find(".lg-item").removeClass("lg-prev-slide lg-current lg-next-slide");
						var touchPrev = void 0;
						var touchNext = void 0;
						if (numberOfGalleryItems > 2) {
							touchPrev = index - 1;
							touchNext = index + 1;
							if (0 === index && prevIndex === numberOfGalleryItems - 1) {
								touchNext = 0;
								touchPrev = numberOfGalleryItems - 1;
							} else if (index === numberOfGalleryItems - 1 && 0 === prevIndex) {
								touchNext = 0;
								touchPrev = numberOfGalleryItems - 1;
							}
						} else {
							touchPrev = 0;
							touchNext = 1;
						}
						if ("prev" === direction) this.getSlideItem(touchNext).addClass("lg-next-slide"); else this.getSlideItem(touchPrev).addClass("lg-prev-slide");
						currentSlideItem.addClass("lg-current");
					}
					if (!this.lGalleryOn) this.loadContent(index, true); else setTimeout((function () {
						_this.loadContent(index, true);
						if (".lg-item" !== _this.settings.appendSubHtmlTo) _this.addHtml(index);
					}), this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
					setTimeout((function () {
						_this.lgBusy = false;
						previousSlideItem_1.removeClass("lg-slide-progress");
						_this.LGel.trigger(lGEvents.afterSlide, {
							prevIndex,
							index,
							fromTouch,
							fromThumb
						});
					}), (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
				}
				this.index = index;
			};
			LightGallery.prototype.updateCurrentCounter = function (index) {
				this.getElementById("lg-counter-current").html(index + 1 + "");
			};
			LightGallery.prototype.updateCounterTotal = function () {
				this.getElementById("lg-counter-all").html(this.galleryItems.length + "");
			};
			LightGallery.prototype.getSlideType = function (item) {
				if (item.__slideVideoInfo) return "video"; else if (item.iframe) return "iframe"; else return "image";
			};
			LightGallery.prototype.touchMove = function (startCoords, endCoords, e) {
				var distanceX = endCoords.pageX - startCoords.pageX;
				var distanceY = endCoords.pageY - startCoords.pageY;
				var allowSwipe = false;
				if (this.swipeDirection) allowSwipe = true; else if (Math.abs(distanceX) > 15) {
					this.swipeDirection = "horizontal";
					allowSwipe = true;
				} else if (Math.abs(distanceY) > 15) {
					this.swipeDirection = "vertical";
					allowSwipe = true;
				}
				if (!allowSwipe) return;
				var $currentSlide = this.getSlideItem(this.index);
				if ("horizontal" === this.swipeDirection) {
					null === e || void 0 === e ? void 0 : e.preventDefault();
					this.outer.addClass("lg-dragging");
					this.setTranslate($currentSlide, distanceX, 0);
					var width = $currentSlide.get().offsetWidth;
					var slideWidthAmount = 15 * width / 100;
					var gutter = slideWidthAmount - Math.abs(10 * distanceX / 100);
					this.setTranslate(this.outer.find(".lg-prev-slide").first(), -width + distanceX - gutter, 0);
					this.setTranslate(this.outer.find(".lg-next-slide").first(), width + distanceX + gutter, 0);
				} else if ("vertical" === this.swipeDirection) if (this.settings.swipeToClose) {
					null === e || void 0 === e ? void 0 : e.preventDefault();
					this.$container.addClass("lg-dragging-vertical");
					var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
					this.$backdrop.css("opacity", opacity);
					var scale = 1 - Math.abs(distanceY) / (2 * window.innerWidth);
					this.setTranslate($currentSlide, 0, distanceY, scale, scale);
					if (Math.abs(distanceY) > 100) this.outer.addClass("lg-hide-items").removeClass("lg-components-open");
				}
			};
			LightGallery.prototype.touchEnd = function (endCoords, startCoords, event) {
				var _this = this;
				var distance;
				if ("lg-slide" !== this.settings.mode) this.outer.addClass("lg-slide");
				setTimeout((function () {
					_this.$container.removeClass("lg-dragging-vertical");
					_this.outer.removeClass("lg-dragging lg-hide-items").addClass("lg-components-open");
					var triggerClick = true;
					if ("horizontal" === _this.swipeDirection) {
						distance = endCoords.pageX - startCoords.pageX;
						var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
						if (distance < 0 && distanceAbs > _this.settings.swipeThreshold) {
							_this.goToNextSlide(true);
							triggerClick = false;
						} else if (distance > 0 && distanceAbs > _this.settings.swipeThreshold) {
							_this.goToPrevSlide(true);
							triggerClick = false;
						}
					} else if ("vertical" === _this.swipeDirection) {
						distance = Math.abs(endCoords.pageY - startCoords.pageY);
						if (_this.settings.closable && _this.settings.swipeToClose && distance > 100) {
							_this.closeGallery();
							return;
						} else _this.$backdrop.css("opacity", 1);
					}
					_this.outer.find(".lg-item").removeAttr("style");
					if (triggerClick && Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
						var target = $LG(event.target);
						if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
					}
					_this.swipeDirection = void 0;
				}));
				setTimeout((function () {
					if (!_this.outer.hasClass("lg-dragging") && "lg-slide" !== _this.settings.mode) _this.outer.removeClass("lg-slide");
				}), this.settings.speed + 100);
			};
			LightGallery.prototype.enableSwipe = function () {
				var _this = this;
				var startCoords = {};
				var endCoords = {};
				var isMoved = false;
				var isSwiping = false;
				if (this.settings.enableSwipe) {
					this.$inner.on("touchstart.lg", (function (e) {
						_this.dragOrSwipeEnabled = true;
						var $item = _this.getSlideItem(_this.index);
						if (($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && !_this.outer.hasClass("lg-zoomed") && !_this.lgBusy && 1 === e.touches.length) {
							isSwiping = true;
							_this.touchAction = "swipe";
							_this.manageSwipeClass();
							startCoords = {
								pageX: e.touches[0].pageX,
								pageY: e.touches[0].pageY
							};
						}
					}));
					this.$inner.on("touchmove.lg", (function (e) {
						if (isSwiping && "swipe" === _this.touchAction && 1 === e.touches.length) {
							endCoords = {
								pageX: e.touches[0].pageX,
								pageY: e.touches[0].pageY
							};
							_this.touchMove(startCoords, endCoords, e);
							isMoved = true;
						}
					}));
					this.$inner.on("touchend.lg", (function (event) {
						if ("swipe" === _this.touchAction) {
							if (isMoved) {
								isMoved = false;
								_this.touchEnd(endCoords, startCoords, event);
							} else if (isSwiping) {
								var target = $LG(event.target);
								if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
							}
							_this.touchAction = void 0;
							isSwiping = false;
						}
					}));
				}
			};
			LightGallery.prototype.enableDrag = function () {
				var _this = this;
				var startCoords = {};
				var endCoords = {};
				var isDraging = false;
				var isMoved = false;
				if (this.settings.enableDrag) {
					this.outer.on("mousedown.lg", (function (e) {
						_this.dragOrSwipeEnabled = true;
						var $item = _this.getSlideItem(_this.index);
						if ($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) if (!_this.outer.hasClass("lg-zoomed") && !_this.lgBusy) {
							e.preventDefault();
							if (!_this.lgBusy) {
								_this.manageSwipeClass();
								startCoords = {
									pageX: e.pageX,
									pageY: e.pageY
								};
								isDraging = true;
								_this.outer.get().scrollLeft += 1;
								_this.outer.get().scrollLeft -= 1;
								_this.outer.removeClass("lg-grab").addClass("lg-grabbing");
								_this.LGel.trigger(lGEvents.dragStart);
							}
						}
					}));
					$LG(window).on("mousemove.lg.global" + this.lgId, (function (e) {
						if (isDraging && _this.lgOpened) {
							isMoved = true;
							endCoords = {
								pageX: e.pageX,
								pageY: e.pageY
							};
							_this.touchMove(startCoords, endCoords);
							_this.LGel.trigger(lGEvents.dragMove);
						}
					}));
					$LG(window).on("mouseup.lg.global" + this.lgId, (function (event) {
						if (!_this.lgOpened) return;
						var target = $LG(event.target);
						if (isMoved) {
							isMoved = false;
							_this.touchEnd(endCoords, startCoords, event);
							_this.LGel.trigger(lGEvents.dragEnd);
						} else if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
						if (isDraging) {
							isDraging = false;
							_this.outer.removeClass("lg-grabbing").addClass("lg-grab");
						}
					}));
				}
			};
			LightGallery.prototype.triggerPosterClick = function () {
				var _this = this;
				this.$inner.on("click.lg", (function (event) {
					if (!_this.dragOrSwipeEnabled && _this.isPosterElement($LG(event.target))) _this.LGel.trigger(lGEvents.posterClick);
				}));
			};
			LightGallery.prototype.manageSwipeClass = function () {
				var _touchNext = this.index + 1;
				var _touchPrev = this.index - 1;
				if (this.settings.loop && this.galleryItems.length > 2) if (0 === this.index) _touchPrev = this.galleryItems.length - 1; else if (this.index === this.galleryItems.length - 1) _touchNext = 0;
				this.outer.find(".lg-item").removeClass("lg-next-slide lg-prev-slide");
				if (_touchPrev > -1) this.getSlideItem(_touchPrev).addClass("lg-prev-slide");
				this.getSlideItem(_touchNext).addClass("lg-next-slide");
			};
			LightGallery.prototype.goToNextSlide = function (fromTouch) {
				var _this = this;
				var _loop = this.settings.loop;
				if (fromTouch && this.galleryItems.length < 3) _loop = false;
				if (!this.lgBusy) if (this.index + 1 < this.galleryItems.length) {
					this.index++;
					this.LGel.trigger(lGEvents.beforeNextSlide, {
						index: this.index
					});
					this.slide(this.index, !!fromTouch, false, "next");
				} else if (_loop) {
					this.index = 0;
					this.LGel.trigger(lGEvents.beforeNextSlide, {
						index: this.index
					});
					this.slide(this.index, !!fromTouch, false, "next");
				} else if (this.settings.slideEndAnimation && !fromTouch) {
					this.outer.addClass("lg-right-end");
					setTimeout((function () {
						_this.outer.removeClass("lg-right-end");
					}), 400);
				}
			};
			LightGallery.prototype.goToPrevSlide = function (fromTouch) {
				var _this = this;
				var _loop = this.settings.loop;
				if (fromTouch && this.galleryItems.length < 3) _loop = false;
				if (!this.lgBusy) if (this.index > 0) {
					this.index--;
					this.LGel.trigger(lGEvents.beforePrevSlide, {
						index: this.index,
						fromTouch
					});
					this.slide(this.index, !!fromTouch, false, "prev");
				} else if (_loop) {
					this.index = this.galleryItems.length - 1;
					this.LGel.trigger(lGEvents.beforePrevSlide, {
						index: this.index,
						fromTouch
					});
					this.slide(this.index, !!fromTouch, false, "prev");
				} else if (this.settings.slideEndAnimation && !fromTouch) {
					this.outer.addClass("lg-left-end");
					setTimeout((function () {
						_this.outer.removeClass("lg-left-end");
					}), 400);
				}
			};
			LightGallery.prototype.keyPress = function () {
				var _this = this;
				$LG(window).on("keydown.lg.global" + this.lgId, (function (e) {
					if (_this.lgOpened && true === _this.settings.escKey && 27 === e.keyCode) {
						e.preventDefault();
						if (_this.settings.allowMediaOverlap && _this.outer.hasClass("lg-can-toggle") && _this.outer.hasClass("lg-components-open")) _this.outer.removeClass("lg-components-open"); else _this.closeGallery();
					}
					if (_this.lgOpened && _this.galleryItems.length > 1) {
						if (37 === e.keyCode) {
							e.preventDefault();
							_this.goToPrevSlide();
						}
						if (39 === e.keyCode) {
							e.preventDefault();
							_this.goToNextSlide();
						}
					}
				}));
			};
			LightGallery.prototype.arrow = function () {
				var _this = this;
				this.getElementById("lg-prev").on("click.lg", (function () {
					_this.goToPrevSlide();
				}));
				this.getElementById("lg-next").on("click.lg", (function () {
					_this.goToNextSlide();
				}));
			};
			LightGallery.prototype.arrowDisable = function (index) {
				if (!this.settings.loop && this.settings.hideControlOnEnd) {
					var $prev = this.getElementById("lg-prev");
					var $next = this.getElementById("lg-next");
					if (index + 1 === this.galleryItems.length) $next.attr("disabled", "disabled").addClass("disabled"); else $next.removeAttr("disabled").removeClass("disabled");
					if (0 === index) $prev.attr("disabled", "disabled").addClass("disabled"); else $prev.removeAttr("disabled").removeClass("disabled");
				}
			};
			LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
				if (void 0 === scaleX) scaleX = 1;
				if (void 0 === scaleY) scaleY = 1;
				$el.css("transform", "translate3d(" + xValue + "px, " + yValue + "px, 0px) scale3d(" + scaleX + ", " + scaleY + ", 1)");
			};
			LightGallery.prototype.mousewheel = function () {
				var _this = this;
				var lastCall = 0;
				this.outer.on("wheel.lg", (function (e) {
					if (!e.deltaY || _this.galleryItems.length < 2) return;
					e.preventDefault();
					var now = (new Date).getTime();
					if (now - lastCall < 1e3) return;
					lastCall = now;
					if (e.deltaY > 0) _this.goToNextSlide(); else if (e.deltaY < 0) _this.goToPrevSlide();
				}));
			};
			LightGallery.prototype.isSlideElement = function (target) {
				return target.hasClass("lg-outer") || target.hasClass("lg-item") || target.hasClass("lg-img-wrap");
			};
			LightGallery.prototype.isPosterElement = function (target) {
				var playButton = this.getSlideItem(this.index).find(".lg-video-play-button").get();
				return target.hasClass("lg-video-poster") || target.hasClass("lg-video-play-button") || playButton && playButton.contains(target.get());
			};
			LightGallery.prototype.toggleMaximize = function () {
				var _this = this;
				this.getElementById("lg-maximize").on("click.lg", (function () {
					_this.$container.toggleClass("lg-inline");
					_this.refreshOnResize();
				}));
			};
			LightGallery.prototype.invalidateItems = function () {
				for (var index = 0; index < this.items.length; index++) {
					var element = this.items[index];
					var $element = $LG(element);
					$element.off("click.lgcustom-item-" + $element.attr("data-lg-id"));
				}
			};
			LightGallery.prototype.trapFocus = function () {
				var _this = this;
				this.$container.get().focus({
					preventScroll: true
				});
				$LG(window).on("keydown.lg.global" + this.lgId, (function (e) {
					if (!_this.lgOpened) return;
					var isTabPressed = "Tab" === e.key || 9 === e.keyCode;
					if (!isTabPressed) return;
					var focusableEls = utils.getFocusableElements(_this.$container.get());
					var firstFocusableEl = focusableEls[0];
					var lastFocusableEl = focusableEls[focusableEls.length - 1];
					if (e.shiftKey) {
						if (document.activeElement === firstFocusableEl) {
							lastFocusableEl.focus();
							e.preventDefault();
						}
					} else if (document.activeElement === lastFocusableEl) {
						firstFocusableEl.focus();
						e.preventDefault();
					}
				}));
			};
			LightGallery.prototype.manageCloseGallery = function () {
				var _this = this;
				if (!this.settings.closable) return;
				var mousedown = false;
				this.getElementById("lg-close").on("click.lg", (function () {
					_this.closeGallery();
				}));
				if (this.settings.closeOnTap) {
					this.outer.on("mousedown.lg", (function (e) {
						var target = $LG(e.target);
						if (_this.isSlideElement(target)) mousedown = true; else mousedown = false;
					}));
					this.outer.on("mousemove.lg", (function () {
						mousedown = false;
					}));
					this.outer.on("mouseup.lg", (function (e) {
						var target = $LG(e.target);
						if (_this.isSlideElement(target) && mousedown) if (!_this.outer.hasClass("lg-dragging")) _this.closeGallery();
					}));
				}
			};
			LightGallery.prototype.closeGallery = function (force) {
				var _this = this;
				if (!this.lgOpened || !this.settings.closable && !force) return 0;
				this.LGel.trigger(lGEvents.beforeClose);
				if (this.settings.resetScrollPosition && !this.settings.hideScrollbar) $LG(window).scrollTop(this.prevScrollTop);
				var currentItem = this.items[this.index];
				var transform;
				if (this.zoomFromOrigin && currentItem) {
					var _a = this.mediaContainerPosition, top_4 = _a.top, bottom = _a.bottom;
					var _b = this.galleryItems[this.index], __slideVideoInfo = _b.__slideVideoInfo, poster = _b.poster;
					var imageSize = utils.getSize(currentItem, this.outer, top_4 + bottom, __slideVideoInfo && poster && this.settings.videoMaxSize);
					transform = utils.getTransform(currentItem, this.outer, top_4, bottom, imageSize);
				}
				if (this.zoomFromOrigin && transform) {
					this.outer.addClass("lg-closing lg-zoom-from-image");
					this.getSlideItem(this.index).addClass("lg-start-end-progress").css("transition-duration", this.settings.startAnimationDuration + "ms").css("transform", transform);
				} else {
					this.outer.addClass("lg-hide-items");
					this.outer.removeClass("lg-zoom-from-image");
				}
				this.destroyModules();
				this.lGalleryOn = false;
				this.isDummyImageRemoved = false;
				this.zoomFromOrigin = this.settings.zoomFromOrigin;
				clearTimeout(this.hideBarTimeout);
				this.hideBarTimeout = false;
				$LG("html").removeClass("lg-on");
				this.outer.removeClass("lg-visible lg-components-open");
				this.$backdrop.removeClass("in").css("opacity", 0);
				var removeTimeout = this.zoomFromOrigin && transform ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration) : this.settings.backdropDuration;
				this.$container.removeClass("lg-show-in");
				setTimeout((function () {
					if (_this.zoomFromOrigin && transform) _this.outer.removeClass("lg-zoom-from-image");
					_this.$container.removeClass("lg-show");
					_this.resetScrollBar();
					_this.$backdrop.removeAttr("style").css("transition-duration", _this.settings.backdropDuration + "ms");
					_this.outer.removeClass("lg-closing " + _this.settings.startClass);
					_this.getSlideItem(_this.index).removeClass("lg-start-end-progress");
					_this.$inner.empty();
					if (_this.lgOpened) _this.LGel.trigger(lGEvents.afterClose, {
						instance: _this
					});
					if (_this.$container.get()) _this.$container.get().blur();
					_this.lgOpened = false;
				}), removeTimeout + 100);
				return removeTimeout + 100;
			};
			LightGallery.prototype.initModules = function () {
				this.plugins.forEach((function (module) {
					try {
						module.init();
					} catch (err) {
						console.warn("lightGallery:- make sure lightGallery module is properly initiated");
					}
				}));
			};
			LightGallery.prototype.destroyModules = function (destroy) {
				this.plugins.forEach((function (module) {
					try {
						if (destroy) module.destroy(); else module.closeGallery && module.closeGallery();
					} catch (err) {
						console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
					}
				}));
			};
			LightGallery.prototype.refresh = function (galleryItems) {
				if (!this.settings.dynamic) this.invalidateItems();
				if (galleryItems) this.galleryItems = galleryItems; else this.galleryItems = this.getItems();
				this.updateControls();
				this.openGalleryOnItemClick();
				this.LGel.trigger(lGEvents.updateSlides);
			};
			LightGallery.prototype.updateControls = function () {
				this.addSlideVideoInfo(this.galleryItems);
				this.updateCounterTotal();
				this.manageSingleSlideClassName();
			};
			LightGallery.prototype.destroyGallery = function () {
				this.destroyModules(true);
				if (!this.settings.dynamic) this.invalidateItems();
				$LG(window).off(".lg.global" + this.lgId);
				this.LGel.off(".lg");
				this.$container.remove();
			};
			LightGallery.prototype.destroy = function () {
				var closeTimeout = this.closeGallery(true);
				if (closeTimeout) setTimeout(this.destroyGallery.bind(this), closeTimeout); else this.destroyGallery();
				return closeTimeout;
			};
			return LightGallery;
		}();
		function lightGallery(el, options) {
			return new LightGallery(el, options);
		}
		return lightGallery;
	}));
	lightGallery(document.getElementById("gallery"), {
		licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
		speed: 300,
		closeOnTap: false,
		hideScrollbar: true,
		counter: false,
		download: false,
		allowMediaOverlap: true,
		loop: false,
		slideEndAnimation: false,
		hideControlOnEnd: true,
		actualSize: false,
		mobileSettings: {
			controls: false,
			showCloseIcon: true
		}
	});
	!function (e) {
		var t = {};
		function o(n) {
			if (t[n]) return t[n].exports;
			var i = t[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports;
		}
		o.m = e, o.c = t, o.d = function (e, t, n) {
			o.o(e, t) || Object.defineProperty(e, t, {
				enumerable: !0,
				get: n
			});
		}, o.r = function (e) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
				value: "Module"
			}), Object.defineProperty(e, "__esModule", {
				value: !0
			});
		}, o.t = function (e, t) {
			if (1 & t && (e = o(e)), 8 & t) return e;
			if (4 & t && "object" == typeof e && e && e.__esModule) return e;
			var n = Object.create(null);
			if (o.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: e
			}), 2 & t && "string" != typeof e) for (var i in e) o.d(n, i, function (t) {
				return e[t];
			}.bind(null, i));
			return n;
		}, o.n = function (e) {
			var t = e && e.__esModule ? function () {
				return e.default;
			} : function () {
				return e;
			};
			return o.d(t, "a", t), t;
		}, o.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t);
		}, o.p = "", o(o.s = 1);
	}([function (e, t, o) {
		"use strict";
		function n() {
			return (n = Object.assign || function (e) {
				for (var t = 1; t < arguments.length; t++) {
					var o = arguments[t];
					for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
				}
				return e;
			}).apply(this, arguments);
		}
		function i(e, t) {
			for (var o = 0; o < t.length; o++) {
				var n = t[o];
				n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0),
					Object.defineProperty(e, n.key, n);
			}
		}
		o.d(t, "a", (function () {
			return s;
		}));
		var s = function () {
			function e(t) {
				!function (e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
				}(this, e);
				this.config = n({
					backscroll: !0,
					linkAttributeName: "data-hystmodal",
					closeOnOverlay: !0,
					closeOnEsc: !0,
					closeOnButton: !0,
					waitTransitions: !1,
					catchFocus: !0,
					fixedSelectors: "*[data-hystfixed]",
					beforeOpen: function () { },
					afterClose: function () { }
				}, t), this.config.linkAttributeName && this.init(), this._closeAfterTransition = this._closeAfterTransition.bind(this);
			}
			var t, o, s;
			return t = e, (o = [{
				key: "init",
				value: function () {
					this.isOpened = !1, this.openedWindow = !1, this.starter = !1, this._nextWindows = !1,
						this._scrollPosition = 0, this._reopenTrigger = !1, this._overlayChecker = !1, this._isMoved = !1,
						this._focusElements = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'],
						this._modalBlock = !1;
					var e = document.querySelector(".hystmodal__shadow");
					e ? this.shadow = e : (this.shadow = document.createElement("div"), this.shadow.classList.add("hystmodal__shadow"),
						document.body.appendChild(this.shadow)), this.eventsFeeler();
				}
			}, {
				key: "eventsFeeler",
				value: function () {
					var e = this;
					document.addEventListener("click", (function (t) {
						var o = t.target.closest("[".concat(e.config.linkAttributeName, "]"));
						if (!e._isMoved && o) {
							t.preventDefault(), e.starter = o;
							var n = e.starter.getAttribute(e.config.linkAttributeName);
							return e._nextWindows = document.querySelector(n), void e.open();
						}
						e.config.closeOnButton && t.target.closest("[data-hystclose]") && e.close();
					})), this.config.closeOnOverlay && (document.addEventListener("mousedown", (function (t) {
						!e._isMoved && t.target instanceof Element && !t.target.classList.contains("hystmodal__wrap") || (e._overlayChecker = !0);
					})), document.addEventListener("mouseup", (function (t) {
						if (!e._isMoved && t.target instanceof Element && e._overlayChecker && t.target.classList.contains("hystmodal__wrap")) return t.preventDefault(),
							e._overlayChecker = !e._overlayChecker, void e.close();
						e._overlayChecker = !1;
					}))), window.addEventListener("keydown", (function (t) {
						if (!e._isMoved && e.config.closeOnEsc && 27 === t.which && e.isOpened) return t.preventDefault(),
							void e.close();
						!e._isMoved && e.config.catchFocus && 9 === t.which && e.isOpened && e.focusCatcher(t);
					}));
				}
			}, {
				key: "open",
				value: function (e) {
					if (e && (this._nextWindows = "string" == typeof e ? document.querySelector(e) : e),
						this._nextWindows) {
						if (this.isOpened) return this._reopenTrigger = !0, void this.close();
						this.openedWindow = this._nextWindows, this._modalBlock = this.openedWindow.querySelector(".hystmodal__window"),
							this.config.beforeOpen(this), this._bodyScrollControl(), this.shadow.classList.add("hystmodal__shadow--show"),
							this.openedWindow.classList.add("hystmodal--active"), this.openedWindow.setAttribute("aria-hidden", "false"),
							this.config.catchFocus && this.focusControl(), this.isOpened = !0;
					} else console.log("Warning: hystModal selector is not found");
				}
			}, {
				key: "close",
				value: function () {
					this.isOpened && (this.config.waitTransitions ? (this.openedWindow.classList.add("hystmodal--moved"),
						this._isMoved = !0, this.openedWindow.addEventListener("transitionend", this._closeAfterTransition),
						this.openedWindow.classList.remove("hystmodal--active")) : (this.openedWindow.classList.remove("hystmodal--active"),
							this._closeAfterTransition()));
				}
			}, {
				key: "_closeAfterTransition",
				value: function () {
					this.openedWindow.classList.remove("hystmodal--moved"), this.openedWindow.removeEventListener("transitionend", this._closeAfterTransition),
						this._isMoved = !1, this.shadow.classList.remove("hystmodal__shadow--show"), this.openedWindow.setAttribute("aria-hidden", "true"),
						this.config.catchFocus && this.focusControl(), this._bodyScrollControl(), this.isOpened = !1,
						this.openedWindow.scrollTop = 0, this.config.afterClose(this), this._reopenTrigger && (this._reopenTrigger = !1,
							this.open());
				}
			}, {
				key: "focusControl",
				value: function () {
					var e = this.openedWindow.querySelectorAll(this._focusElements);
					this.isOpened && this.starter ? this.starter.focus() : e.length && e[0].focus();
				}
			}, {
				key: "focusCatcher",
				value: function (e) {
					var t = this.openedWindow.querySelectorAll(this._focusElements), o = Array.prototype.slice.call(t);
					if (this.openedWindow.contains(document.activeElement)) {
						var n = o.indexOf(document.activeElement);
						e.shiftKey && 0 === n && (o[o.length - 1].focus(), e.preventDefault()), e.shiftKey || n !== o.length - 1 || (o[0].focus(),
							e.preventDefault());
					} else o[0].focus(), e.preventDefault();
				}
			}, {
				key: "_bodyScrollControl",
				value: function () {
					if (this.config.backscroll) {
						var e = document.querySelectorAll(this.config.fixedSelectors), t = Array.prototype.slice.call(e), o = document.documentElement;
						if (!0 === this.isOpened) return o.classList.remove("hystmodal__opened"), o.style.marginRight = "",
							t.forEach((function (e) {
								e.style.marginRight = "";
							})), window.scrollTo(0, this._scrollPosition), void (o.style.top = "");
						this._scrollPosition = window.pageYOffset;
						var n = window.innerWidth - o.clientWidth;
						o.style.top = "".concat(-this._scrollPosition, "px"), n && (o.style.marginRight = "".concat(n, "px"),
							t.forEach((function (e) {
								e.style.marginRight = "".concat(parseInt(getComputedStyle(e).marginRight, 10) + n, "px");
							}))), o.classList.add("hystmodal__opened");
					}
				}
			}]) && i(t.prototype, o), s && i(t, s), Object.defineProperty(t, "prototype", {
				writable: !1
			}), e;
		}();
	}, function (e, t, o) {
		"use strict";
		o.r(t), function (e) {
			var t = o(0);
			o(3), o(4);
			e.HystModal = t.a;
		}.call(this, o(2));
	}, function (e, t) {
		var o;
		o = function () {
			return this;
		}();
		try {
			o = o || new Function("return this")();
		} catch (e) {
			"object" == typeof window && (o = window);
		}
		e.exports = o;
	}, function (e, t) {
		"undefined" != typeof Element && (Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
			Element.prototype.closest || (Element.prototype.closest = function (e) {
				var t = this;
				do {
					if (t.matches(e)) return t;
					t = t.parentElement || t.parentNode;
				} while (null !== t && 1 === t.nodeType);
				return null;
			}));
	}, function (e, t, o) { }]);
	!function (e, t) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t();
	}(void 0, (function () {
		"use strict";
		function e(e) {
			return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object;
		}
		function t(s, a) {
			void 0 === s && (s = {}), void 0 === a && (a = {}), Object.keys(a).forEach((i => {
				void 0 === s[i] ? s[i] = a[i] : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i]);
			}));
		}
		const s = {
			body: {},
			addEventListener() { },
			removeEventListener() { },
			activeElement: {
				blur() { },
				nodeName: ""
			},
			querySelector: () => null,
			querySelectorAll: () => [],
			getElementById: () => null,
			createEvent: () => ({
				initEvent() { }
			}),
			createElement: () => ({
				children: [],
				childNodes: [],
				style: {},
				setAttribute() { },
				getElementsByTagName: () => []
			}),
			createElementNS: () => ({}),
			importNode: () => null,
			location: {
				hash: "",
				host: "",
				hostname: "",
				href: "",
				origin: "",
				pathname: "",
				protocol: "",
				search: ""
			}
		};
		function a() {
			const e = "undefined" != typeof document ? document : {};
			return t(e, s), e;
		}
		const i = {
			document: s,
			navigator: {
				userAgent: ""
			},
			location: {
				hash: "",
				host: "",
				hostname: "",
				href: "",
				origin: "",
				pathname: "",
				protocol: "",
				search: ""
			},
			history: {
				replaceState() { },
				pushState() { },
				go() { },
				back() { }
			},
			CustomEvent: function () {
				return this;
			},
			addEventListener() { },
			removeEventListener() { },
			getComputedStyle: () => ({
				getPropertyValue: () => ""
			}),
			Image() { },
			Date() { },
			screen: {},
			setTimeout() { },
			clearTimeout() { },
			matchMedia: () => ({}),
			requestAnimationFrame: e => "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
			cancelAnimationFrame(e) {
				"undefined" != typeof setTimeout && clearTimeout(e);
			}
		};
		function r() {
			const e = "undefined" != typeof window ? window : {};
			return t(e, i), e;
		}
		class n extends Array {
			constructor(e) {
				"number" == typeof e ? super(e) : (super(...e || []), function (e) {
					const t = e.__proto__;
					Object.defineProperty(e, "__proto__", {
						get: () => t,
						set(e) {
							t.__proto__ = e;
						}
					});
				}(this));
			}
		}
		function l(e) {
			void 0 === e && (e = []);
			const t = [];
			return e.forEach((e => {
				Array.isArray(e) ? t.push(...l(e)) : t.push(e);
			})), t;
		}
		function o(e, t) {
			return Array.prototype.filter.call(e, t);
		}
		function d(e, t) {
			const s = r(), i = a();
			let l = [];
			if (!t && e instanceof n) return e;
			if (!e) return new n(l);
			if ("string" == typeof e) {
				const s = e.trim();
				if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
					let e = "div";
					0 === s.indexOf("<li") && (e = "ul"), 0 === s.indexOf("<tr") && (e = "tbody"), 0 !== s.indexOf("<td") && 0 !== s.indexOf("<th") || (e = "tr"),
						0 === s.indexOf("<tbody") && (e = "table"), 0 === s.indexOf("<option") && (e = "select");
					const t = i.createElement(e);
					t.innerHTML = s;
					for (let e = 0; e < t.childNodes.length; e += 1) l.push(t.childNodes[e]);
				} else l = function (e, t) {
					if ("string" != typeof e) return [e];
					const s = [], a = t.querySelectorAll(e);
					for (let e = 0; e < a.length; e += 1) s.push(a[e]);
					return s;
				}(e.trim(), t || i);
			} else if (e.nodeType || e === s || e === i) l.push(e); else if (Array.isArray(e)) {
				if (e instanceof n) return e;
				l = e;
			}
			return new n(function (e) {
				const t = [];
				for (let s = 0; s < e.length; s += 1) -1 === t.indexOf(e[s]) && t.push(e[s]);
				return t;
			}(l));
		}
		d.fn = n.prototype;
		const c = {
			addClass: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				const a = l(t.map((e => e.split(" "))));
				return this.forEach((e => {
					e.classList.add(...a);
				})), this;
			},
			removeClass: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				const a = l(t.map((e => e.split(" "))));
				return this.forEach((e => {
					e.classList.remove(...a);
				})), this;
			},
			hasClass: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				const a = l(t.map((e => e.split(" "))));
				return o(this, (e => a.filter((t => e.classList.contains(t))).length > 0)).length > 0;
			},
			toggleClass: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				const a = l(t.map((e => e.split(" "))));
				this.forEach((e => {
					a.forEach((t => {
						e.classList.toggle(t);
					}));
				}));
			},
			attr: function (e, t) {
				if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
				for (let s = 0; s < this.length; s += 1) if (2 === arguments.length) this[s].setAttribute(e, t); else for (const t in e) this[s][t] = e[t],
					this[s].setAttribute(t, e[t]);
				return this;
			},
			removeAttr: function (e) {
				for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
				return this;
			},
			transform: function (e) {
				for (let t = 0; t < this.length; t += 1) this[t].style.transform = e;
				return this;
			},
			transition: function (e) {
				for (let t = 0; t < this.length; t += 1) this[t].style.transitionDuration = "string" != typeof e ? `${e}ms` : e;
				return this;
			},
			on: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				let [a, i, r, n] = t;
				function l(e) {
					const t = e.target;
					if (!t) return;
					const s = e.target.dom7EventData || [];
					if (s.indexOf(e) < 0 && s.unshift(e), d(t).is(i)) r.apply(t, s); else {
						const e = d(t).parents();
						for (let t = 0; t < e.length; t += 1) d(e[t]).is(i) && r.apply(e[t], s);
					}
				}
				function o(e) {
					const t = e && e.target && e.target.dom7EventData || [];
					t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t);
				}
				"function" == typeof t[1] && ([a, r, n] = t, i = void 0), n || (n = !1);
				const c = a.split(" ");
				let p;
				for (let e = 0; e < this.length; e += 1) {
					const t = this[e];
					if (i) for (p = 0; p < c.length; p += 1) {
						const e = c[p];
						t.dom7LiveListeners || (t.dom7LiveListeners = {}), t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
							t.dom7LiveListeners[e].push({
								listener: r,
								proxyListener: l
							}), t.addEventListener(e, l, n);
					} else for (p = 0; p < c.length; p += 1) {
						const e = c[p];
						t.dom7Listeners || (t.dom7Listeners = {}), t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
							t.dom7Listeners[e].push({
								listener: r,
								proxyListener: o
							}), t.addEventListener(e, o, n);
					}
				}
				return this;
			},
			off: function () {
				for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
				let [a, i, r, n] = t;
				"function" == typeof t[1] && ([a, r, n] = t, i = void 0), n || (n = !1);
				const l = a.split(" ");
				for (let e = 0; e < l.length; e += 1) {
					const t = l[e];
					for (let e = 0; e < this.length; e += 1) {
						const s = this[e];
						let a;
						if (!i && s.dom7Listeners ? a = s.dom7Listeners[t] : i && s.dom7LiveListeners && (a = s.dom7LiveListeners[t]),
							a && a.length) for (let e = a.length - 1; e >= 0; e -= 1) {
								const i = a[e];
								r && i.listener === r || r && i.listener && i.listener.dom7proxy && i.listener.dom7proxy === r ? (s.removeEventListener(t, i.proxyListener, n),
									a.splice(e, 1)) : r || (s.removeEventListener(t, i.proxyListener, n), a.splice(e, 1));
							}
					}
				}
				return this;
			},
			trigger: function () {
				const e = r();
				for (var t = arguments.length, s = new Array(t), a = 0; a < t; a++) s[a] = arguments[a];
				const i = s[0].split(" "), n = s[1];
				for (let t = 0; t < i.length; t += 1) {
					const a = i[t];
					for (let t = 0; t < this.length; t += 1) {
						const i = this[t];
						if (e.CustomEvent) {
							const t = new e.CustomEvent(a, {
								detail: n,
								bubbles: !0,
								cancelable: !0
							});
							i.dom7EventData = s.filter(((e, t) => t > 0)), i.dispatchEvent(t), i.dom7EventData = [],
								delete i.dom7EventData;
						}
					}
				}
				return this;
			},
			transitionEnd: function (e) {
				const t = this;
				return e && t.on("transitionend", (function s(a) {
					a.target === this && (e.call(this, a), t.off("transitionend", s));
				})), this;
			},
			outerWidth: function (e) {
				if (this.length > 0) {
					if (e) {
						const e = this.styles();
						return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"));
					}
					return this[0].offsetWidth;
				}
				return null;
			},
			outerHeight: function (e) {
				if (this.length > 0) {
					if (e) {
						const e = this.styles();
						return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"));
					}
					return this[0].offsetHeight;
				}
				return null;
			},
			styles: function () {
				const e = r();
				return this[0] ? e.getComputedStyle(this[0], null) : {};
			},
			offset: function () {
				if (this.length > 0) {
					const e = r(), t = a(), s = this[0], i = s.getBoundingClientRect(), n = t.body, l = s.clientTop || n.clientTop || 0, o = s.clientLeft || n.clientLeft || 0, d = s === e ? e.scrollY : s.scrollTop, c = s === e ? e.scrollX : s.scrollLeft;
					return {
						top: i.top + d - l,
						left: i.left + c - o
					};
				}
				return null;
			},
			css: function (e, t) {
				const s = r();
				let a;
				if (1 === arguments.length) {
					if ("string" != typeof e) {
						for (a = 0; a < this.length; a += 1) for (const t in e) this[a].style[t] = e[t];
						return this;
					}
					if (this[0]) return s.getComputedStyle(this[0], null).getPropertyValue(e);
				}
				if (2 === arguments.length && "string" == typeof e) {
					for (a = 0; a < this.length; a += 1) this[a].style[e] = t;
					return this;
				}
				return this;
			},
			each: function (e) {
				return e ? (this.forEach(((t, s) => {
					e.apply(t, [t, s]);
				})), this) : this;
			},
			html: function (e) {
				if (void 0 === e) return this[0] ? this[0].innerHTML : null;
				for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
				return this;
			},
			text: function (e) {
				if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
				for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
				return this;
			},
			is: function (e) {
				const t = r(), s = a(), i = this[0];
				let l, o;
				if (!i || void 0 === e) return !1;
				if ("string" == typeof e) {
					if (i.matches) return i.matches(e);
					if (i.webkitMatchesSelector) return i.webkitMatchesSelector(e);
					if (i.msMatchesSelector) return i.msMatchesSelector(e);
					for (l = d(e), o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
					return !1;
				}
				if (e === s) return i === s;
				if (e === t) return i === t;
				if (e.nodeType || e instanceof n) {
					for (l = e.nodeType ? [e] : e, o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
					return !1;
				}
				return !1;
			},
			index: function () {
				let e, t = this[0];
				if (t) {
					for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1);
					return e;
				}
			},
			eq: function (e) {
				if (void 0 === e) return this;
				const t = this.length;
				if (e > t - 1) return d([]);
				if (e < 0) {
					const s = t + e;
					return d(s < 0 ? [] : [this[s]]);
				}
				return d([this[e]]);
			},
			append: function () {
				let e;
				const t = a();
				for (let s = 0; s < arguments.length; s += 1) {
					e = s < 0 || arguments.length <= s ? void 0 : arguments[s];
					for (let s = 0; s < this.length; s += 1) if ("string" == typeof e) {
						const a = t.createElement("div");
						for (a.innerHTML = e; a.firstChild;) this[s].appendChild(a.firstChild);
					} else if (e instanceof n) for (let t = 0; t < e.length; t += 1) this[s].appendChild(e[t]); else this[s].appendChild(e);
				}
				return this;
			},
			prepend: function (e) {
				const t = a();
				let s, i;
				for (s = 0; s < this.length; s += 1) if ("string" == typeof e) {
					const a = t.createElement("div");
					for (a.innerHTML = e, i = a.childNodes.length - 1; i >= 0; i -= 1) this[s].insertBefore(a.childNodes[i], this[s].childNodes[0]);
				} else if (e instanceof n) for (i = 0; i < e.length; i += 1) this[s].insertBefore(e[i], this[s].childNodes[0]); else this[s].insertBefore(e, this[s].childNodes[0]);
				return this;
			},
			next: function (e) {
				return this.length > 0 ? e ? this[0].nextElementSibling && d(this[0].nextElementSibling).is(e) ? d([this[0].nextElementSibling]) : d([]) : this[0].nextElementSibling ? d([this[0].nextElementSibling]) : d([]) : d([]);
			},
			nextAll: function (e) {
				const t = [];
				let s = this[0];
				if (!s) return d([]);
				for (; s.nextElementSibling;) {
					const a = s.nextElementSibling;
					e ? d(a).is(e) && t.push(a) : t.push(a), s = a;
				}
				return d(t);
			},
			prev: function (e) {
				if (this.length > 0) {
					const t = this[0];
					return e ? t.previousElementSibling && d(t.previousElementSibling).is(e) ? d([t.previousElementSibling]) : d([]) : t.previousElementSibling ? d([t.previousElementSibling]) : d([]);
				}
				return d([]);
			},
			prevAll: function (e) {
				const t = [];
				let s = this[0];
				if (!s) return d([]);
				for (; s.previousElementSibling;) {
					const a = s.previousElementSibling;
					e ? d(a).is(e) && t.push(a) : t.push(a), s = a;
				}
				return d(t);
			},
			parent: function (e) {
				const t = [];
				for (let s = 0; s < this.length; s += 1) null !== this[s].parentNode && (e ? d(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode));
				return d(t);
			},
			parents: function (e) {
				const t = [];
				for (let s = 0; s < this.length; s += 1) {
					let a = this[s].parentNode;
					for (; a;) e ? d(a).is(e) && t.push(a) : t.push(a), a = a.parentNode;
				}
				return d(t);
			},
			closest: function (e) {
				let t = this;
				return void 0 === e ? d([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
			},
			find: function (e) {
				const t = [];
				for (let s = 0; s < this.length; s += 1) {
					const a = this[s].querySelectorAll(e);
					for (let e = 0; e < a.length; e += 1) t.push(a[e]);
				}
				return d(t);
			},
			children: function (e) {
				const t = [];
				for (let s = 0; s < this.length; s += 1) {
					const a = this[s].children;
					for (let s = 0; s < a.length; s += 1) e && !d(a[s]).is(e) || t.push(a[s]);
				}
				return d(t);
			},
			filter: function (e) {
				return d(o(this, e));
			},
			remove: function () {
				for (let e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
				return this;
			}
		};
		function p(e, t) {
			return void 0 === t && (t = 0), setTimeout(e, t);
		}
		function u() {
			return Date.now();
		}
		function h(e, t) {
			void 0 === t && (t = "x");
			const s = r();
			let a, i, n;
			const l = function (e) {
				const t = r();
				let s;
				return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle),
					s || (s = e.style), s;
			}(e);
			return s.WebKitCSSMatrix ? (i = l.transform || l.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((e => e.replace(",", "."))).join(", ")),
				n = new s.WebKitCSSMatrix("none" === i ? "" : i)) : (n = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"),
					a = n.toString().split(",")), "x" === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])),
				"y" === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])),
				i || 0;
		}
		function m(e) {
			return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1);
		}
		function f(e) {
			return "undefined" != typeof window && void 0 !== window.HTMLElement ? e instanceof HTMLElement : e && (1 === e.nodeType || 11 === e.nodeType);
		}
		function g() {
			const e = Object(arguments.length <= 0 ? void 0 : arguments[0]), t = ["__proto__", "constructor", "prototype"];
			for (let s = 1; s < arguments.length; s += 1) {
				const a = s < 0 || arguments.length <= s ? void 0 : arguments[s];
				if (null != a && !f(a)) {
					const s = Object.keys(Object(a)).filter((e => t.indexOf(e) < 0));
					for (let t = 0, i = s.length; t < i; t += 1) {
						const i = s[t], r = Object.getOwnPropertyDescriptor(a, i);
						void 0 !== r && r.enumerable && (m(e[i]) && m(a[i]) ? a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i]) : !m(e[i]) && m(a[i]) ? (e[i] = {},
							a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i])) : e[i] = a[i]);
					}
				}
			}
			return e;
		}
		function v(e, t, s) {
			e.style.setProperty(t, s);
		}
		function w(e) {
			let { swiper: t, targetPosition: s, side: a } = e;
			const i = r(), n = -t.translate;
			let l, o = null;
			const d = t.params.speed;
			t.wrapperEl.style.scrollSnapType = "none", i.cancelAnimationFrame(t.cssModeFrameID);
			const c = s > n ? "next" : "prev", p = (e, t) => "next" === c && e >= t || "prev" === c && e <= t, u = () => {
				l = (new Date).getTime(), null === o && (o = l);
				const e = Math.max(Math.min((l - o) / d, 1), 0), r = .5 - Math.cos(e * Math.PI) / 2;
				let c = n + r * (s - n);
				if (p(c, s) && (c = s), t.wrapperEl.scrollTo({
					[a]: c
				}), p(c, s)) return t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.scrollSnapType = "",
					setTimeout((() => {
						t.wrapperEl.style.overflow = "", t.wrapperEl.scrollTo({
							[a]: c
						});
					})), void i.cancelAnimationFrame(t.cssModeFrameID);
				t.cssModeFrameID = i.requestAnimationFrame(u);
			};
			u();
		}
		let b, x, y;
		function E() {
			return b || (b = function () {
				const e = r(), t = a();
				return {
					smoothScroll: t.documentElement && "scrollBehavior" in t.documentElement.style,
					touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch),
					passiveListener: function () {
						let t = !1;
						try {
							const s = Object.defineProperty({}, "passive", {
								get() {
									t = !0;
								}
							});
							e.addEventListener("testPassiveListener", null, s);
						} catch (e) { }
						return t;
					}(),
					gestures: "ongesturestart" in e
				};
			}()), b;
		}
		function C(e) {
			return void 0 === e && (e = {}), x || (x = function (e) {
				let { userAgent: t } = void 0 === e ? {} : e;
				const s = E(), a = r(), i = a.navigator.platform, n = t || a.navigator.userAgent, l = {
					ios: !1,
					android: !1
				}, o = a.screen.width, d = a.screen.height, c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
				let p = n.match(/(iPad).*OS\s([\d_]+)/);
				const u = n.match(/(iPod)(.*OS\s([\d_]+))?/), h = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/), m = "Win32" === i;
				let f = "MacIntel" === i;
				return !p && f && s.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${d}`) >= 0 && (p = n.match(/(Version)\/([\d.]+)/),
					p || (p = [0, 1, "13_0_0"]), f = !1), c && !m && (l.os = "android", l.android = !0),
					(p || h || u) && (l.os = "ios", l.ios = !0), l;
			}(e)), x;
		}
		function T() {
			return y || (y = function () {
				const e = r();
				return {
					isSafari: function () {
						const t = e.navigator.userAgent.toLowerCase();
						return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0;
					}(),
					isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
				};
			}()), y;
		}
		Object.keys(c).forEach((e => {
			Object.defineProperty(d.fn, e, {
				value: c[e],
				writable: !0
			});
		}));
		var $ = {
			on(e, t, s) {
				const a = this;
				if (!a.eventsListeners || a.destroyed) return a;
				if ("function" != typeof t) return a;
				const i = s ? "unshift" : "push";
				return e.split(" ").forEach((e => {
					a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][i](t);
				})), a;
			},
			once(e, t, s) {
				const a = this;
				if (!a.eventsListeners || a.destroyed) return a;
				if ("function" != typeof t) return a;
				function i() {
					a.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
					for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n];
					t.apply(a, r);
				}
				return i.__emitterProxy = t, a.on(e, i, s);
			},
			onAny(e, t) {
				const s = this;
				if (!s.eventsListeners || s.destroyed) return s;
				if ("function" != typeof e) return s;
				const a = t ? "unshift" : "push";
				return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e), s;
			},
			offAny(e) {
				const t = this;
				if (!t.eventsListeners || t.destroyed) return t;
				if (!t.eventsAnyListeners) return t;
				const s = t.eventsAnyListeners.indexOf(e);
				return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
			},
			off(e, t) {
				const s = this;
				return !s.eventsListeners || s.destroyed ? s : s.eventsListeners ? (e.split(" ").forEach((e => {
					void 0 === t ? s.eventsListeners[e] = [] : s.eventsListeners[e] && s.eventsListeners[e].forEach(((a, i) => {
						(a === t || a.__emitterProxy && a.__emitterProxy === t) && s.eventsListeners[e].splice(i, 1);
					}));
				})), s) : s;
			},
			emit() {
				const e = this;
				if (!e.eventsListeners || e.destroyed) return e;
				if (!e.eventsListeners) return e;
				let t, s, a;
				for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++) r[n] = arguments[n];
				"string" == typeof r[0] || Array.isArray(r[0]) ? (t = r[0], s = r.slice(1, r.length),
					a = e) : (t = r[0].events, s = r[0].data, a = r[0].context || e), s.unshift(a);
				return (Array.isArray(t) ? t : t.split(" ")).forEach((t => {
					e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e => {
						e.apply(a, [t, ...s]);
					})), e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e => {
						e.apply(a, s);
					}));
				})), e;
			}
		};
		var S = {
			updateSize: function () {
				const e = this;
				let t, s;
				const a = e.$el;
				t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a[0].clientWidth,
					s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a[0].clientHeight,
					0 === t && e.isHorizontal() || 0 === s && e.isVertical() || (t = t - parseInt(a.css("padding-left") || 0, 10) - parseInt(a.css("padding-right") || 0, 10),
						s = s - parseInt(a.css("padding-top") || 0, 10) - parseInt(a.css("padding-bottom") || 0, 10),
						Number.isNaN(t) && (t = 0), Number.isNaN(s) && (s = 0), Object.assign(e, {
							width: t,
							height: s,
							size: e.isHorizontal() ? t : s
						}));
			},
			updateSlides: function () {
				const e = this;
				function t(t) {
					return e.isHorizontal() ? t : {
						width: "height",
						"margin-top": "margin-left",
						"margin-bottom ": "margin-right",
						"margin-left": "margin-top",
						"margin-right": "margin-bottom",
						"padding-left": "padding-top",
						"padding-right": "padding-bottom",
						marginRight: "marginBottom"
					}[t];
				}
				function s(e, s) {
					return parseFloat(e.getPropertyValue(t(s)) || 0);
				}
				const a = e.params, { $wrapperEl: i, size: r, rtlTranslate: n, wrongRTL: l } = e, o = e.virtual && a.virtual.enabled, d = o ? e.virtual.slides.length : e.slides.length, c = i.children(`.${e.params.slideClass}`), p = o ? e.virtual.slides.length : c.length;
				let u = [];
				const h = [], m = [];
				let f = a.slidesOffsetBefore;
				"function" == typeof f && (f = a.slidesOffsetBefore.call(e));
				let g = a.slidesOffsetAfter;
				"function" == typeof g && (g = a.slidesOffsetAfter.call(e));
				const w = e.snapGrid.length, b = e.slidesGrid.length;
				let x = a.spaceBetween, y = -f, E = 0, C = 0;
				if (void 0 === r) return;
				"string" == typeof x && x.indexOf("%") >= 0 && (x = parseFloat(x.replace("%", "")) / 100 * r),
					e.virtualSize = -x, n ? c.css({
						marginLeft: "",
						marginBottom: "",
						marginTop: ""
					}) : c.css({
						marginRight: "",
						marginBottom: "",
						marginTop: ""
					}), a.centeredSlides && a.cssMode && (v(e.wrapperEl, "--swiper-centered-offset-before", ""),
						v(e.wrapperEl, "--swiper-centered-offset-after", ""));
				const T = a.grid && a.grid.rows > 1 && e.grid;
				let $;
				T && e.grid.initSlides(p);
				const S = "auto" === a.slidesPerView && a.breakpoints && Object.keys(a.breakpoints).filter((e => void 0 !== a.breakpoints[e].slidesPerView)).length > 0;
				for (let i = 0; i < p; i += 1) {
					$ = 0;
					const n = c.eq(i);
					if (T && e.grid.updateSlide(i, n, p, t), "none" !== n.css("display")) {
						if ("auto" === a.slidesPerView) {
							S && (c[i].style[t("width")] = "");
							const r = getComputedStyle(n[0]), l = n[0].style.transform, o = n[0].style.webkitTransform;
							if (l && (n[0].style.transform = "none"), o && (n[0].style.webkitTransform = "none"),
								a.roundLengths) $ = e.isHorizontal() ? n.outerWidth(!0) : n.outerHeight(!0); else {
								const e = s(r, "width"), t = s(r, "padding-left"), a = s(r, "padding-right"), i = s(r, "margin-left"), l = s(r, "margin-right"), o = r.getPropertyValue("box-sizing");
								if (o && "border-box" === o) $ = e + i + l; else {
									const { clientWidth: s, offsetWidth: r } = n[0];
									$ = e + t + a + i + l + (r - s);
								}
							}
							l && (n[0].style.transform = l), o && (n[0].style.webkitTransform = o), a.roundLengths && ($ = Math.floor($));
						} else $ = (r - (a.slidesPerView - 1) * x) / a.slidesPerView, a.roundLengths && ($ = Math.floor($)),
							c[i] && (c[i].style[t("width")] = `${$}px`);
						c[i] && (c[i].swiperSlideSize = $), m.push($), a.centeredSlides ? (y = y + $ / 2 + E / 2 + x,
							0 === E && 0 !== i && (y = y - r / 2 - x), 0 === i && (y = y - r / 2 - x), Math.abs(y) < .001 && (y = 0),
							a.roundLengths && (y = Math.floor(y)), C % a.slidesPerGroup == 0 && u.push(y), h.push(y)) : (a.roundLengths && (y = Math.floor(y)),
								(C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && u.push(y),
								h.push(y), y = y + $ + x), e.virtualSize += $ + x, E = $, C += 1;
					}
				}
				if (e.virtualSize = Math.max(e.virtualSize, r) + g, n && l && ("slide" === a.effect || "coverflow" === a.effect) && i.css({
					width: `${e.virtualSize + a.spaceBetween}px`
				}), a.setWrapperSize && i.css({
					[t("width")]: `${e.virtualSize + a.spaceBetween}px`
				}), T && e.grid.updateWrapperSize($, u, t), !a.centeredSlides) {
					const t = [];
					for (let s = 0; s < u.length; s += 1) {
						let i = u[s];
						a.roundLengths && (i = Math.floor(i)), u[s] <= e.virtualSize - r && t.push(i);
					}
					u = t, Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 && u.push(e.virtualSize - r);
				}
				if (0 === u.length && (u = [0]), 0 !== a.spaceBetween) {
					const s = e.isHorizontal() && n ? "marginLeft" : t("marginRight");
					c.filter(((e, t) => !a.cssMode || t !== c.length - 1)).css({
						[s]: `${x}px`
					});
				}
				if (a.centeredSlides && a.centeredSlidesBounds) {
					let e = 0;
					m.forEach((t => {
						e += t + (a.spaceBetween ? a.spaceBetween : 0);
					})), e -= a.spaceBetween;
					const t = e - r;
					u = u.map((e => e < 0 ? -f : e > t ? t + g : e));
				}
				if (a.centerInsufficientSlides) {
					let e = 0;
					if (m.forEach((t => {
						e += t + (a.spaceBetween ? a.spaceBetween : 0);
					})), e -= a.spaceBetween, e < r) {
						const t = (r - e) / 2;
						u.forEach(((e, s) => {
							u[s] = e - t;
						})), h.forEach(((e, s) => {
							h[s] = e + t;
						}));
					}
				}
				if (Object.assign(e, {
					slides: c,
					snapGrid: u,
					slidesGrid: h,
					slidesSizesGrid: m
				}), a.centeredSlides && a.cssMode && !a.centeredSlidesBounds) {
					v(e.wrapperEl, "--swiper-centered-offset-before", -u[0] + "px"), v(e.wrapperEl, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
					const t = -e.snapGrid[0], s = -e.slidesGrid[0];
					e.snapGrid = e.snapGrid.map((e => e + t)), e.slidesGrid = e.slidesGrid.map((e => e + s));
				}
				if (p !== d && e.emit("slidesLengthChange"), u.length !== w && (e.params.watchOverflow && e.checkOverflow(),
					e.emit("snapGridLengthChange")), h.length !== b && e.emit("slidesGridLengthChange"),
					a.watchSlidesProgress && e.updateSlidesOffset(), !(o || a.cssMode || "slide" !== a.effect && "fade" !== a.effect)) {
					const t = `${a.containerModifierClass}backface-hidden`, s = e.$el.hasClass(t);
					p <= a.maxBackfaceHiddenSlides ? s || e.$el.addClass(t) : s && e.$el.removeClass(t);
				}
			},
			updateAutoHeight: function (e) {
				const t = this, s = [], a = t.virtual && t.params.virtual.enabled;
				let i, r = 0;
				"number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
				const n = e => a ? t.slides.filter((t => parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e))[0] : t.slides.eq(e)[0];
				if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1) if (t.params.centeredSlides) (t.visibleSlides || d([])).each((e => {
					s.push(e);
				})); else for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
					const e = t.activeIndex + i;
					if (e > t.slides.length && !a) break;
					s.push(n(e));
				} else s.push(n(t.activeIndex));
				for (i = 0; i < s.length; i += 1) if (void 0 !== s[i]) {
					const e = s[i].offsetHeight;
					r = e > r ? e : r;
				}
				(r || 0 === r) && t.$wrapperEl.css("height", `${r}px`);
			},
			updateSlidesOffset: function () {
				const e = this, t = e.slides;
				for (let s = 0; s < t.length; s += 1) t[s].swiperSlideOffset = e.isHorizontal() ? t[s].offsetLeft : t[s].offsetTop;
			},
			updateSlidesProgress: function (e) {
				void 0 === e && (e = this && this.translate || 0);
				const t = this, s = t.params, { slides: a, rtlTranslate: i, snapGrid: r } = t;
				if (0 === a.length) return;
				void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
				let n = -e;
				i && (n = e), a.removeClass(s.slideVisibleClass), t.visibleSlidesIndexes = [], t.visibleSlides = [];
				for (let e = 0; e < a.length; e += 1) {
					const l = a[e];
					let o = l.swiperSlideOffset;
					s.cssMode && s.centeredSlides && (o -= a[0].swiperSlideOffset);
					const d = (n + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween), c = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween), p = -(n - o), u = p + t.slidesSizesGrid[e];
					(p >= 0 && p < t.size - 1 || u > 1 && u <= t.size || p <= 0 && u >= t.size) && (t.visibleSlides.push(l),
						t.visibleSlidesIndexes.push(e), a.eq(e).addClass(s.slideVisibleClass)), l.progress = i ? -d : d,
						l.originalProgress = i ? -c : c;
				}
				t.visibleSlides = d(t.visibleSlides);
			},
			updateProgress: function (e) {
				const t = this;
				if (void 0 === e) {
					const s = t.rtlTranslate ? -1 : 1;
					e = t && t.translate && t.translate * s || 0;
				}
				const s = t.params, a = t.maxTranslate() - t.minTranslate();
				let { progress: i, isBeginning: r, isEnd: n } = t;
				const l = r, o = n;
				0 === a ? (i = 0, r = !0, n = !0) : (i = (e - t.minTranslate()) / a, r = i <= 0,
					n = i >= 1), Object.assign(t, {
						progress: i,
						isBeginning: r,
						isEnd: n
					}), (s.watchSlidesProgress || s.centeredSlides && s.autoHeight) && t.updateSlidesProgress(e),
					r && !l && t.emit("reachBeginning toEdge"), n && !o && t.emit("reachEnd toEdge"),
					(l && !r || o && !n) && t.emit("fromEdge"), t.emit("progress", i);
			},
			updateSlidesClasses: function () {
				const e = this, { slides: t, params: s, $wrapperEl: a, activeIndex: i, realIndex: r } = e, n = e.virtual && s.virtual.enabled;
				let l;
				t.removeClass(`${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`),
					l = n ? e.$wrapperEl.find(`.${s.slideClass}[data-swiper-slide-index="${i}"]`) : t.eq(i),
					l.addClass(s.slideActiveClass), s.loop && (l.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass));
				let o = l.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);
				s.loop && 0 === o.length && (o = t.eq(0), o.addClass(s.slideNextClass));
				let d = l.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);
				s.loop && 0 === d.length && (d = t.eq(-1), d.addClass(s.slidePrevClass)), s.loop && (o.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass),
					d.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass)),
					e.emitSlidesClasses();
			},
			updateActiveIndex: function (e) {
				const t = this, s = t.rtlTranslate ? t.translate : -t.translate, { slidesGrid: a, snapGrid: i, params: r, activeIndex: n, realIndex: l, snapIndex: o } = t;
				let d, c = e;
				if (void 0 === c) {
					for (let e = 0; e < a.length; e += 1) void 0 !== a[e + 1] ? s >= a[e] && s < a[e + 1] - (a[e + 1] - a[e]) / 2 ? c = e : s >= a[e] && s < a[e + 1] && (c = e + 1) : s >= a[e] && (c = e);
					r.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
				}
				if (i.indexOf(s) >= 0) d = i.indexOf(s); else {
					const e = Math.min(r.slidesPerGroupSkip, c);
					d = e + Math.floor((c - e) / r.slidesPerGroup);
				}
				if (d >= i.length && (d = i.length - 1), c === n) return void (d !== o && (t.snapIndex = d,
					t.emit("snapIndexChange")));
				const p = parseInt(t.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
				Object.assign(t, {
					snapIndex: d,
					realIndex: p,
					previousIndex: n,
					activeIndex: c
				}), t.emit("activeIndexChange"), t.emit("snapIndexChange"), l !== p && t.emit("realIndexChange"),
					(t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange");
			},
			updateClickedSlide: function (e) {
				const t = this, s = t.params, a = d(e).closest(`.${s.slideClass}`)[0];
				let i, r = !1;
				if (a) for (let e = 0; e < t.slides.length; e += 1) if (t.slides[e] === a) {
					r = !0, i = e;
					break;
				}
				if (!a || !r) return t.clickedSlide = void 0, void (t.clickedIndex = void 0);
				t.clickedSlide = a, t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt(d(a).attr("data-swiper-slide-index"), 10) : t.clickedIndex = i,
					s.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide();
			}
		};
		var M = {
			getTranslate: function (e) {
				void 0 === e && (e = this.isHorizontal() ? "x" : "y");
				const { params: t, rtlTranslate: s, translate: a, $wrapperEl: i } = this;
				if (t.virtualTranslate) return s ? -a : a;
				if (t.cssMode) return a;
				let r = h(i[0], e);
				return s && (r = -r), r || 0;
			},
			setTranslate: function (e, t) {
				const s = this, { rtlTranslate: a, params: i, $wrapperEl: r, wrapperEl: n, progress: l } = s;
				let o, d = 0, c = 0;
				s.isHorizontal() ? d = a ? -e : e : c = e, i.roundLengths && (d = Math.floor(d),
					c = Math.floor(c)), i.cssMode ? n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -d : -c : i.virtualTranslate || r.transform(`translate3d(${d}px, ${c}px, 0px)`),
					s.previousTranslate = s.translate, s.translate = s.isHorizontal() ? d : c;
				const p = s.maxTranslate() - s.minTranslate();
				o = 0 === p ? 0 : (e - s.minTranslate()) / p, o !== l && s.updateProgress(e), s.emit("setTranslate", s.translate, t);
			},
			minTranslate: function () {
				return -this.snapGrid[0];
			},
			maxTranslate: function () {
				return -this.snapGrid[this.snapGrid.length - 1];
			},
			translateTo: function (e, t, s, a, i) {
				void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0),
					void 0 === a && (a = !0);
				const r = this, { params: n, wrapperEl: l } = r;
				if (r.animating && n.preventInteractionOnTransition) return !1;
				const o = r.minTranslate(), d = r.maxTranslate();
				let c;
				if (c = a && e > o ? o : a && e < d ? d : e, r.updateProgress(c), n.cssMode) {
					const e = r.isHorizontal();
					if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c; else {
						if (!r.support.smoothScroll) return w({
							swiper: r,
							targetPosition: -c,
							side: e ? "left" : "top"
						}), !0;
						l.scrollTo({
							[e ? "left" : "top"]: -c,
							behavior: "smooth"
						});
					}
					return !0;
				}
				return 0 === t ? (r.setTransition(0), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i),
					r.emit("transitionEnd"))) : (r.setTransition(t), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i),
						r.emit("transitionStart")), r.animating || (r.animating = !0, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function (e) {
							r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
								r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd),
								r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd,
								s && r.emit("transitionEnd"));
						}), r.$wrapperEl[0].addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
							r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd))),
					!0;
			}
		};
		function P(e) {
			let { swiper: t, runCallbacks: s, direction: a, step: i } = e;
			const { activeIndex: r, previousIndex: n } = t;
			let l = a;
			if (l || (l = r > n ? "next" : r < n ? "prev" : "reset"), t.emit(`transition${i}`),
				s && r !== n) {
				if ("reset" === l) return void t.emit(`slideResetTransition${i}`);
				t.emit(`slideChangeTransition${i}`), "next" === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`);
			}
		}
		var k = {
			slideTo: function (e, t, s, a, i) {
				if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0),
					"number" != typeof e && "string" != typeof e) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`);
				if ("string" == typeof e) {
					const t = parseInt(e, 10);
					if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
					e = t;
				}
				const r = this;
				let n = e;
				n < 0 && (n = 0);
				const { params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: p, rtlTranslate: u, wrapperEl: h, enabled: m } = r;
				if (r.animating && l.preventInteractionOnTransition || !m && !a && !i) return !1;
				const f = Math.min(r.params.slidesPerGroupSkip, n);
				let g = f + Math.floor((n - f) / r.params.slidesPerGroup);
				g >= o.length && (g = o.length - 1);
				const v = -o[g];
				if (l.normalizeSlideIndex) for (let e = 0; e < d.length; e += 1) {
					const t = -Math.floor(100 * v), s = Math.floor(100 * d[e]), a = Math.floor(100 * d[e + 1]);
					void 0 !== d[e + 1] ? t >= s && t < a - (a - s) / 2 ? n = e : t >= s && t < a && (n = e + 1) : t >= s && (n = e);
				}
				if (r.initialized && n !== p) {
					if (!r.allowSlideNext && v < r.translate && v < r.minTranslate()) return !1;
					if (!r.allowSlidePrev && v > r.translate && v > r.maxTranslate() && (p || 0) !== n) return !1;
				}
				let b;
				if (n !== (c || 0) && s && r.emit("beforeSlideChangeStart"), r.updateProgress(v),
					b = n > p ? "next" : n < p ? "prev" : "reset", u && -v === r.translate || !u && v === r.translate) return r.updateActiveIndex(n),
						l.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== l.effect && r.setTranslate(v),
						"reset" !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)), !1;
				if (l.cssMode) {
					const e = r.isHorizontal(), s = u ? v : -v;
					if (0 === t) {
						const t = r.virtual && r.params.virtual.enabled;
						t && (r.wrapperEl.style.scrollSnapType = "none", r._immediateVirtual = !0), h[e ? "scrollLeft" : "scrollTop"] = s,
							t && requestAnimationFrame((() => {
								r.wrapperEl.style.scrollSnapType = "", r._swiperImmediateVirtual = !1;
							}));
					} else {
						if (!r.support.smoothScroll) return w({
							swiper: r,
							targetPosition: s,
							side: e ? "left" : "top"
						}), !0;
						h.scrollTo({
							[e ? "left" : "top"]: s,
							behavior: "smooth"
						});
					}
					return !0;
				}
				return r.setTransition(t), r.setTranslate(v), r.updateActiveIndex(n), r.updateSlidesClasses(),
					r.emit("beforeTransitionStart", t, a), r.transitionStart(s, b), 0 === t ? r.transitionEnd(s, b) : r.animating || (r.animating = !0,
						r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function (e) {
							r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
								r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd),
								r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd,
								r.transitionEnd(s, b));
						}), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
						r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd)),
					!0;
			},
			slideToLoop: function (e, t, s, a) {
				if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0),
					"string" == typeof e) {
					const t = parseInt(e, 10);
					if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
					e = t;
				}
				const i = this;
				let r = e;
				return i.params.loop && (r += i.loopedSlides), i.slideTo(r, t, s, a);
			},
			slideNext: function (e, t, s) {
				void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
				const a = this, { animating: i, enabled: r, params: n } = a;
				if (!r) return a;
				let l = n.slidesPerGroup;
				"auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic("current", !0), 1));
				const o = a.activeIndex < n.slidesPerGroupSkip ? 1 : l;
				if (n.loop) {
					if (i && n.loopPreventsSlide) return !1;
					a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft;
				}
				return n.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s);
			},
			slidePrev: function (e, t, s) {
				void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
				const a = this, { params: i, animating: r, snapGrid: n, slidesGrid: l, rtlTranslate: o, enabled: d } = a;
				if (!d) return a;
				if (i.loop) {
					if (r && i.loopPreventsSlide) return !1;
					a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft;
				}
				function c(e) {
					return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
				}
				const p = c(o ? a.translate : -a.translate), u = n.map((e => c(e)));
				let h = n[u.indexOf(p) - 1];
				if (void 0 === h && i.cssMode) {
					let e;
					n.forEach(((t, s) => {
						p >= t && (e = s);
					})), void 0 !== e && (h = n[e > 0 ? e - 1 : e]);
				}
				let m = 0;
				if (void 0 !== h && (m = l.indexOf(h), m < 0 && (m = a.activeIndex - 1), "auto" === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && (m = m - a.slidesPerViewDynamic("previous", !0) + 1,
					m = Math.max(m, 0))), i.rewind && a.isBeginning) {
					const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
					return a.slideTo(i, e, t, s);
				}
				return a.slideTo(m, e, t, s);
			},
			slideReset: function (e, t, s) {
				return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, s);
			},
			slideToClosest: function (e, t, s, a) {
				void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === a && (a = .5);
				const i = this;
				let r = i.activeIndex;
				const n = Math.min(i.params.slidesPerGroupSkip, r), l = n + Math.floor((r - n) / i.params.slidesPerGroup), o = i.rtlTranslate ? i.translate : -i.translate;
				if (o >= i.snapGrid[l]) {
					const e = i.snapGrid[l];
					o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup);
				} else {
					const e = i.snapGrid[l - 1];
					o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup);
				}
				return r = Math.max(r, 0), r = Math.min(r, i.slidesGrid.length - 1), i.slideTo(r, e, t, s);
			},
			slideToClickedSlide: function () {
				const e = this, { params: t, $wrapperEl: s } = e, a = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
				let i, r = e.clickedIndex;
				if (t.loop) {
					if (e.animating) return;
					i = parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10), t.centeredSlides ? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2 ? (e.loopFix(),
						r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),
						p((() => {
							e.slideTo(r);
						}))) : e.slideTo(r) : r > e.slides.length - a ? (e.loopFix(), r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),
							p((() => {
								e.slideTo(r);
							}))) : e.slideTo(r);
				} else e.slideTo(r);
			}
		};
		var z = {
			loopCreate: function () {
				const e = this, t = a(), { params: s, $wrapperEl: i } = e, r = i.children().length > 0 ? d(i.children()[0].parentNode) : i;
				r.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();
				let n = r.children(`.${s.slideClass}`);
				if (s.loopFillGroupWithBlank) {
					const e = s.slidesPerGroup - n.length % s.slidesPerGroup;
					if (e !== s.slidesPerGroup) {
						for (let a = 0; a < e; a += 1) {
							const e = d(t.createElement("div")).addClass(`${s.slideClass} ${s.slideBlankClass}`);
							r.append(e);
						}
						n = r.children(`.${s.slideClass}`);
					}
				}
				"auto" !== s.slidesPerView || s.loopedSlides || (s.loopedSlides = n.length), e.loopedSlides = Math.ceil(parseFloat(s.loopedSlides || s.slidesPerView, 10)),
					e.loopedSlides += s.loopAdditionalSlides, e.loopedSlides > n.length && e.params.loopedSlidesLimit && (e.loopedSlides = n.length);
				const l = [], o = [];
				n.each(((e, t) => {
					d(e).attr("data-swiper-slide-index", t);
				}));
				for (let t = 0; t < e.loopedSlides; t += 1) {
					const e = t - Math.floor(t / n.length) * n.length;
					o.push(n.eq(e)[0]), l.unshift(n.eq(n.length - e - 1)[0]);
				}
				for (let e = 0; e < o.length; e += 1) r.append(d(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
				for (let e = l.length - 1; e >= 0; e -= 1) r.prepend(d(l[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
			},
			loopFix: function () {
				const e = this;
				e.emit("beforeLoopFix");
				const { activeIndex: t, slides: s, loopedSlides: a, allowSlidePrev: i, allowSlideNext: r, snapGrid: n, rtlTranslate: l } = e;
				let o;
				e.allowSlidePrev = !0, e.allowSlideNext = !0;
				const d = -n[t] - e.getTranslate();
				if (t < a) {
					o = s.length - 3 * a + t, o += a;
					e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
				} else if (t >= s.length - a) {
					o = -s.length + t + a, o += a;
					e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
				}
				e.allowSlidePrev = i, e.allowSlideNext = r, e.emit("loopFix");
			},
			loopDestroy: function () {
				const { $wrapperEl: e, params: t, slides: s } = this;
				e.children(`.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`).remove(),
					s.removeAttr("data-swiper-slide-index");
			}
		};
		function L(e) {
			const t = this, s = a(), i = r(), n = t.touchEventsData, { params: l, touches: o, enabled: c } = t;
			if (!c) return;
			if (t.animating && l.preventInteractionOnTransition) return;
			!t.animating && l.cssMode && l.loop && t.loopFix();
			let p = e;
			p.originalEvent && (p = p.originalEvent);
			let h = d(p.target);
			if ("wrapper" === l.touchEventsTarget && !h.closest(t.wrapperEl).length) return;
			if (n.isTouchEvent = "touchstart" === p.type, !n.isTouchEvent && "which" in p && 3 === p.which) return;
			if (!n.isTouchEvent && "button" in p && p.button > 0) return;
			if (n.isTouched && n.isMoved) return;
			const m = !!l.noSwipingClass && "" !== l.noSwipingClass, f = e.composedPath ? e.composedPath() : e.path;
			m && p.target && p.target.shadowRoot && f && (h = d(f[0]));
			const g = l.noSwipingSelector ? l.noSwipingSelector : `.${l.noSwipingClass}`, v = !(!p.target || !p.target.shadowRoot);
			if (l.noSwiping && (v ? function (e, t) {
				return void 0 === t && (t = this), function t(s) {
					if (!s || s === a() || s === r()) return null;
					s.assignedSlot && (s = s.assignedSlot);
					const i = s.closest(e);
					return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
				}(t);
			}(g, h[0]) : h.closest(g)[0])) return void (t.allowClick = !0);
			if (l.swipeHandler && !h.closest(l.swipeHandler)[0]) return;
			o.currentX = "touchstart" === p.type ? p.targetTouches[0].pageX : p.pageX, o.currentY = "touchstart" === p.type ? p.targetTouches[0].pageY : p.pageY;
			const w = o.currentX, b = o.currentY, x = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection, y = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold;
			if (x && (w <= y || w >= i.innerWidth - y)) {
				if ("prevent" !== x) return;
				e.preventDefault();
			}
			if (Object.assign(n, {
				isTouched: !0,
				isMoved: !1,
				allowTouchCallbacks: !0,
				isScrolling: void 0,
				startMoving: void 0
			}), o.startX = w, o.startY = b, n.touchStartTime = u(), t.allowClick = !0, t.updateSize(),
				t.swipeDirection = void 0, l.threshold > 0 && (n.allowThresholdMove = !1), "touchstart" !== p.type) {
				let e = !0;
				h.is(n.focusableElements) && (e = !1, "SELECT" === h[0].nodeName && (n.isTouched = !1)),
					s.activeElement && d(s.activeElement).is(n.focusableElements) && s.activeElement !== h[0] && s.activeElement.blur();
				const a = e && t.allowTouchMove && l.touchStartPreventDefault;
				!l.touchStartForcePreventDefault && !a || h[0].isContentEditable || p.preventDefault();
			}
			t.params.freeMode && t.params.freeMode.enabled && t.freeMode && t.animating && !l.cssMode && t.freeMode.onTouchStart(),
				t.emit("touchStart", p);
		}
		function O(e) {
			const t = a(), s = this, i = s.touchEventsData, { params: r, touches: n, rtlTranslate: l, enabled: o } = s;
			if (!o) return;
			let c = e;
			if (c.originalEvent && (c = c.originalEvent), !i.isTouched) return void (i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", c));
			if (i.isTouchEvent && "touchmove" !== c.type) return;
			const p = "touchmove" === c.type && c.targetTouches && (c.targetTouches[0] || c.changedTouches[0]), h = "touchmove" === c.type ? p.pageX : c.pageX, m = "touchmove" === c.type ? p.pageY : c.pageY;
			if (c.preventedByNestedSwiper) return n.startX = h, void (n.startY = m);
			if (!s.allowTouchMove) return d(c.target).is(i.focusableElements) || (s.allowClick = !1),
				void (i.isTouched && (Object.assign(n, {
					startX: h,
					startY: m,
					currentX: h,
					currentY: m
				}), i.touchStartTime = u()));
			if (i.isTouchEvent && r.touchReleaseOnEdges && !r.loop) if (s.isVertical()) {
				if (m < n.startY && s.translate <= s.maxTranslate() || m > n.startY && s.translate >= s.minTranslate()) return i.isTouched = !1,
					void (i.isMoved = !1);
			} else if (h < n.startX && s.translate <= s.maxTranslate() || h > n.startX && s.translate >= s.minTranslate()) return;
			if (i.isTouchEvent && t.activeElement && c.target === t.activeElement && d(c.target).is(i.focusableElements)) return i.isMoved = !0,
				void (s.allowClick = !1);
			if (i.allowTouchCallbacks && s.emit("touchMove", c), c.targetTouches && c.targetTouches.length > 1) return;
			n.currentX = h, n.currentY = m;
			const f = n.currentX - n.startX, g = n.currentY - n.startY;
			if (s.params.threshold && Math.sqrt(f ** 2 + g ** 2) < s.params.threshold) return;
			if (void 0 === i.isScrolling) {
				let e;
				s.isHorizontal() && n.currentY === n.startY || s.isVertical() && n.currentX === n.startX ? i.isScrolling = !1 : f * f + g * g >= 25 && (e = 180 * Math.atan2(Math.abs(g), Math.abs(f)) / Math.PI,
					i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle);
			}
			if (i.isScrolling && s.emit("touchMoveOpposite", c), void 0 === i.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (i.startMoving = !0)),
				i.isScrolling) return void (i.isTouched = !1);
			if (!i.startMoving) return;
			s.allowClick = !1, !r.cssMode && c.cancelable && c.preventDefault(), r.touchMoveStopPropagation && !r.nested && c.stopPropagation(),
				i.isMoved || (r.loop && !r.cssMode && s.loopFix(), i.startTranslate = s.getTranslate(),
					s.setTransition(0), s.animating && s.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
					i.allowMomentumBounce = !1, !r.grabCursor || !0 !== s.allowSlideNext && !0 !== s.allowSlidePrev || s.setGrabCursor(!0),
					s.emit("sliderFirstMove", c)), s.emit("sliderMove", c), i.isMoved = !0;
			let v = s.isHorizontal() ? f : g;
			n.diff = v, v *= r.touchRatio, l && (v = -v), s.swipeDirection = v > 0 ? "prev" : "next",
				i.currentTranslate = v + i.startTranslate;
			let w = !0, b = r.resistanceRatio;
			if (r.touchReleaseOnEdges && (b = 0), v > 0 && i.currentTranslate > s.minTranslate() ? (w = !1,
				r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + v) ** b)) : v < 0 && i.currentTranslate < s.maxTranslate() && (w = !1,
					r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - v) ** b)),
				w && (c.preventedByNestedSwiper = !0), !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate),
				!s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate),
				s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate),
				r.threshold > 0) {
				if (!(Math.abs(v) > r.threshold || i.allowThresholdMove)) return void (i.currentTranslate = i.startTranslate);
				if (!i.allowThresholdMove) return i.allowThresholdMove = !0, n.startX = n.currentX,
					n.startY = n.currentY, i.currentTranslate = i.startTranslate, void (n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY);
			}
			r.followFinger && !r.cssMode && ((r.freeMode && r.freeMode.enabled && s.freeMode || r.watchSlidesProgress) && (s.updateActiveIndex(),
				s.updateSlidesClasses()), s.params.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(),
				s.updateProgress(i.currentTranslate), s.setTranslate(i.currentTranslate));
		}
		function I(e) {
			const t = this, s = t.touchEventsData, { params: a, touches: i, rtlTranslate: r, slidesGrid: n, enabled: l } = t;
			if (!l) return;
			let o = e;
			if (o.originalEvent && (o = o.originalEvent), s.allowTouchCallbacks && t.emit("touchEnd", o),
				s.allowTouchCallbacks = !1, !s.isTouched) return s.isMoved && a.grabCursor && t.setGrabCursor(!1),
					s.isMoved = !1, void (s.startMoving = !1);
			a.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
			const d = u(), c = d - s.touchStartTime;
			if (t.allowClick) {
				const e = o.path || o.composedPath && o.composedPath();
				t.updateClickedSlide(e && e[0] || o.target), t.emit("tap click", o), c < 300 && d - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", o);
			}
			if (s.lastClickTime = u(), p((() => {
				t.destroyed || (t.allowClick = !0);
			})), !s.isTouched || !s.isMoved || !t.swipeDirection || 0 === i.diff || s.currentTranslate === s.startTranslate) return s.isTouched = !1,
				s.isMoved = !1, void (s.startMoving = !1);
			let h;
			if (s.isTouched = !1, s.isMoved = !1, s.startMoving = !1, h = a.followFinger ? r ? t.translate : -t.translate : -s.currentTranslate,
				a.cssMode) return;
			if (t.params.freeMode && a.freeMode.enabled) return void t.freeMode.onTouchEnd({
				currentPos: h
			});
			let m = 0, f = t.slidesSizesGrid[0];
			for (let e = 0; e < n.length; e += e < a.slidesPerGroupSkip ? 1 : a.slidesPerGroup) {
				const t = e < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
				void 0 !== n[e + t] ? h >= n[e] && h < n[e + t] && (m = e, f = n[e + t] - n[e]) : h >= n[e] && (m = e,
					f = n[n.length - 1] - n[n.length - 2]);
			}
			let g = null, v = null;
			a.rewind && (t.isBeginning ? v = t.params.virtual && t.params.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (g = 0));
			const w = (h - n[m]) / f, b = m < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
			if (c > a.longSwipesMs) {
				if (!a.longSwipes) return void t.slideTo(t.activeIndex);
				"next" === t.swipeDirection && (w >= a.longSwipesRatio ? t.slideTo(a.rewind && t.isEnd ? g : m + b) : t.slideTo(m)),
					"prev" === t.swipeDirection && (w > 1 - a.longSwipesRatio ? t.slideTo(m + b) : null !== v && w < 0 && Math.abs(w) > a.longSwipesRatio ? t.slideTo(v) : t.slideTo(m));
			} else {
				if (!a.shortSwipes) return void t.slideTo(t.activeIndex);
				t.navigation && (o.target === t.navigation.nextEl || o.target === t.navigation.prevEl) ? o.target === t.navigation.nextEl ? t.slideTo(m + b) : t.slideTo(m) : ("next" === t.swipeDirection && t.slideTo(null !== g ? g : m + b),
					"prev" === t.swipeDirection && t.slideTo(null !== v ? v : m));
			}
		}
		function A() {
			const e = this, { params: t, el: s } = e;
			if (s && 0 === s.offsetWidth) return;
			t.breakpoints && e.setBreakpoint();
			const { allowSlideNext: a, allowSlidePrev: i, snapGrid: r } = e;
			e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(),
				e.updateSlidesClasses(), ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0),
				e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(), e.allowSlidePrev = i,
				e.allowSlideNext = a, e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
		}
		function D(e) {
			const t = this;
			t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(),
				e.stopImmediatePropagation())));
		}
		function G() {
			const e = this, { wrapperEl: t, rtlTranslate: s, enabled: a } = e;
			if (!a) return;
			let i;
			e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop,
				0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
			const r = e.maxTranslate() - e.minTranslate();
			i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r, i !== e.progress && e.updateProgress(s ? -e.translate : e.translate),
				e.emit("setTranslate", e.translate, !1);
		}
		let N = !1;
		function B() { }
		const H = (e, t) => {
			const s = a(), { params: i, touchEvents: r, el: n, wrapperEl: l, device: o, support: d } = e, c = !!i.nested, p = "on" === t ? "addEventListener" : "removeEventListener", u = t;
			if (d.touch) {
				const t = !("touchstart" !== r.start || !d.passiveListener || !i.passiveListeners) && {
					passive: !0,
					capture: !1
				};
				n[p](r.start, e.onTouchStart, t), n[p](r.move, e.onTouchMove, d.passiveListener ? {
					passive: !1,
					capture: c
				} : c), n[p](r.end, e.onTouchEnd, t), r.cancel && n[p](r.cancel, e.onTouchEnd, t);
			} else n[p](r.start, e.onTouchStart, !1), s[p](r.move, e.onTouchMove, c), s[p](r.end, e.onTouchEnd, !1);
			(i.preventClicks || i.preventClicksPropagation) && n[p]("click", e.onClick, !0),
				i.cssMode && l[p]("scroll", e.onScroll), i.updateOnWindowResize ? e[u](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", A, !0) : e[u]("observerUpdate", A, !0);
		};
		var X = {
			attachEvents: function () {
				const e = this, t = a(), { params: s, support: i } = e;
				e.onTouchStart = L.bind(e), e.onTouchMove = O.bind(e), e.onTouchEnd = I.bind(e),
					s.cssMode && (e.onScroll = G.bind(e)), e.onClick = D.bind(e), i.touch && !N && (t.addEventListener("touchstart", B),
						N = !0), H(e, "on");
			},
			detachEvents: function () {
				H(this, "off");
			}
		};
		const Y = (e, t) => e.grid && t.grid && t.grid.rows > 1;
		var R = {
			addClasses: function () {
				const e = this, { classNames: t, params: s, rtl: a, $el: i, device: r, support: n } = e, l = function (e, t) {
					const s = [];
					return e.forEach((e => {
						"object" == typeof e ? Object.keys(e).forEach((a => {
							e[a] && s.push(t + a);
						})) : "string" == typeof e && s.push(t + e);
					})), s;
				}(["initialized", s.direction, {
					"pointer-events": !n.touch
				}, {
						"free-mode": e.params.freeMode && s.freeMode.enabled
					}, {
						autoheight: s.autoHeight
					}, {
						rtl: a
					}, {
						grid: s.grid && s.grid.rows > 1
					}, {
						"grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill
					}, {
						android: r.android
					}, {
						ios: r.ios
					}, {
						"css-mode": s.cssMode
					}, {
						centered: s.cssMode && s.centeredSlides
					}, {
						"watch-progress": s.watchSlidesProgress
					}], s.containerModifierClass);
				t.push(...l), i.addClass([...t].join(" ")), e.emitContainerClasses();
			},
			removeClasses: function () {
				const { $el: e, classNames: t } = this;
				e.removeClass(t.join(" ")), this.emitContainerClasses();
			}
		};
		var W = {
			init: !0,
			direction: "horizontal",
			touchEventsTarget: "wrapper",
			initialSlide: 0,
			speed: 300,
			cssMode: !1,
			updateOnWindowResize: !0,
			resizeObserver: !0,
			nested: !1,
			createElements: !1,
			enabled: !0,
			focusableElements: "input, select, option, textarea, button, video, label",
			width: null,
			height: null,
			preventInteractionOnTransition: !1,
			userAgent: null,
			url: null,
			edgeSwipeDetection: !1,
			edgeSwipeThreshold: 20,
			autoHeight: !1,
			setWrapperSize: !1,
			virtualTranslate: !1,
			effect: "slide",
			breakpoints: void 0,
			breakpointsBase: "window",
			spaceBetween: 0,
			slidesPerView: 1,
			slidesPerGroup: 1,
			slidesPerGroupSkip: 0,
			slidesPerGroupAuto: !1,
			centeredSlides: !1,
			centeredSlidesBounds: !1,
			slidesOffsetBefore: 0,
			slidesOffsetAfter: 0,
			normalizeSlideIndex: !0,
			centerInsufficientSlides: !1,
			watchOverflow: !0,
			roundLengths: !1,
			touchRatio: 1,
			touchAngle: 45,
			simulateTouch: !0,
			shortSwipes: !0,
			longSwipes: !0,
			longSwipesRatio: .5,
			longSwipesMs: 300,
			followFinger: !0,
			allowTouchMove: !0,
			threshold: 0,
			touchMoveStopPropagation: !1,
			touchStartPreventDefault: !0,
			touchStartForcePreventDefault: !1,
			touchReleaseOnEdges: !1,
			uniqueNavElements: !0,
			resistance: !0,
			resistanceRatio: .85,
			watchSlidesProgress: !1,
			grabCursor: !1,
			preventClicks: !0,
			preventClicksPropagation: !0,
			slideToClickedSlide: !1,
			preloadImages: !0,
			updateOnImagesReady: !0,
			loop: !1,
			loopAdditionalSlides: 0,
			loopedSlides: null,
			loopedSlidesLimit: !0,
			loopFillGroupWithBlank: !1,
			loopPreventsSlide: !0,
			rewind: !1,
			allowSlidePrev: !0,
			allowSlideNext: !0,
			swipeHandler: null,
			noSwiping: !0,
			noSwipingClass: "swiper-no-swiping",
			noSwipingSelector: null,
			passiveListeners: !0,
			maxBackfaceHiddenSlides: 10,
			containerModifierClass: "swiper-",
			slideClass: "swiper-slide",
			slideBlankClass: "swiper-slide-invisible-blank",
			slideActiveClass: "swiper-slide-active",
			slideDuplicateActiveClass: "swiper-slide-duplicate-active",
			slideVisibleClass: "swiper-slide-visible",
			slideDuplicateClass: "swiper-slide-duplicate",
			slideNextClass: "swiper-slide-next",
			slideDuplicateNextClass: "swiper-slide-duplicate-next",
			slidePrevClass: "swiper-slide-prev",
			slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
			wrapperClass: "swiper-wrapper",
			runCallbacksOnInit: !0,
			_emitClasses: !1
		};
		function q(e, t) {
			return function (s) {
				void 0 === s && (s = {});
				const a = Object.keys(s)[0], i = s[a];
				"object" == typeof i && null !== i ? (["navigation", "pagination", "scrollbar"].indexOf(a) >= 0 && !0 === e[a] && (e[a] = {
					auto: !0
				}), a in e && "enabled" in i ? (!0 === e[a] && (e[a] = {
					enabled: !0
				}), "object" != typeof e[a] || "enabled" in e[a] || (e[a].enabled = !0), e[a] || (e[a] = {
					enabled: !1
				}), g(t, s)) : g(t, s)) : g(t, s);
			};
		}
		const j = {
			eventsEmitter: $,
			update: S,
			translate: M,
			transition: {
				setTransition: function (e, t) {
					const s = this;
					s.params.cssMode || s.$wrapperEl.transition(e), s.emit("setTransition", e, t);
				},
				transitionStart: function (e, t) {
					void 0 === e && (e = !0);
					const s = this, { params: a } = s;
					a.cssMode || (a.autoHeight && s.updateAutoHeight(), P({
						swiper: s,
						runCallbacks: e,
						direction: t,
						step: "Start"
					}));
				},
				transitionEnd: function (e, t) {
					void 0 === e && (e = !0);
					const s = this, { params: a } = s;
					s.animating = !1, a.cssMode || (s.setTransition(0), P({
						swiper: s,
						runCallbacks: e,
						direction: t,
						step: "End"
					}));
				}
			},
			slide: k,
			loop: z,
			grabCursor: {
				setGrabCursor: function (e) {
					const t = this;
					if (t.support.touch || !t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode) return;
					const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
					s.style.cursor = "move", s.style.cursor = e ? "grabbing" : "grab";
				},
				unsetGrabCursor: function () {
					const e = this;
					e.support.touch || e.params.watchOverflow && e.isLocked || e.params.cssMode || (e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "");
				}
			},
			events: X,
			breakpoints: {
				setBreakpoint: function () {
					const e = this, { activeIndex: t, initialized: s, loopedSlides: a = 0, params: i, $el: r } = e, n = i.breakpoints;
					if (!n || n && 0 === Object.keys(n).length) return;
					const l = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
					if (!l || e.currentBreakpoint === l) return;
					const o = (l in n ? n[l] : void 0) || e.originalParams, d = Y(e, i), c = Y(e, o), p = i.enabled;
					d && !c ? (r.removeClass(`${i.containerModifierClass}grid ${i.containerModifierClass}grid-column`),
						e.emitContainerClasses()) : !d && c && (r.addClass(`${i.containerModifierClass}grid`),
							(o.grid.fill && "column" === o.grid.fill || !o.grid.fill && "column" === i.grid.fill) && r.addClass(`${i.containerModifierClass}grid-column`),
							e.emitContainerClasses()), ["navigation", "pagination", "scrollbar"].forEach((t => {
								const s = i[t] && i[t].enabled, a = o[t] && o[t].enabled;
								s && !a && e[t].disable(), !s && a && e[t].enable();
							}));
					const u = o.direction && o.direction !== i.direction, h = i.loop && (o.slidesPerView !== i.slidesPerView || u);
					u && s && e.changeDirection(), g(e.params, o);
					const m = e.params.enabled;
					Object.assign(e, {
						allowTouchMove: e.params.allowTouchMove,
						allowSlideNext: e.params.allowSlideNext,
						allowSlidePrev: e.params.allowSlidePrev
					}), p && !m ? e.disable() : !p && m && e.enable(), e.currentBreakpoint = l, e.emit("_beforeBreakpoint", o),
						h && s && (e.loopDestroy(), e.loopCreate(), e.updateSlides(), e.slideTo(t - a + e.loopedSlides, 0, !1)),
						e.emit("breakpoint", o);
				},
				getBreakpoint: function (e, t, s) {
					if (void 0 === t && (t = "window"), !e || "container" === t && !s) return;
					let a = !1;
					const i = r(), n = "window" === t ? i.innerHeight : s.clientHeight, l = Object.keys(e).map((e => {
						if ("string" == typeof e && 0 === e.indexOf("@")) {
							const t = parseFloat(e.substr(1));
							return {
								value: n * t,
								point: e
							};
						}
						return {
							value: e,
							point: e
						};
					}));
					l.sort(((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10)));
					for (let e = 0; e < l.length; e += 1) {
						const { point: r, value: n } = l[e];
						"window" === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r);
					}
					return a || "max";
				}
			},
			checkOverflow: {
				checkOverflow: function () {
					const e = this, { isLocked: t, params: s } = e, { slidesOffsetBefore: a } = s;
					if (a) {
						const t = e.slides.length - 1, s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
						e.isLocked = e.size > s;
					} else e.isLocked = 1 === e.snapGrid.length;
					!0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked), !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
						t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
				}
			},
			classes: R,
			images: {
				loadImage: function (e, t, s, a, i, n) {
					const l = r();
					let o;
					function c() {
						n && n();
					}
					d(e).parent("picture")[0] || e.complete && i ? c() : t ? (o = new l.Image, o.onload = c,
						o.onerror = c, a && (o.sizes = a), s && (o.srcset = s), t && (o.src = t)) : c();
				},
				preloadImages: function () {
					const e = this;
					function t() {
						null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
							e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(),
								e.emit("imagesReady")));
					}
					e.imagesToLoad = e.$el.find("img");
					for (let s = 0; s < e.imagesToLoad.length; s += 1) {
						const a = e.imagesToLoad[s];
						e.loadImage(a, a.currentSrc || a.getAttribute("src"), a.srcset || a.getAttribute("srcset"), a.sizes || a.getAttribute("sizes"), !0, t);
					}
				}
			}
		}, _ = {};
		class V {
			constructor() {
				let e, t;
				for (var s = arguments.length, a = new Array(s), i = 0; i < s; i++) a[i] = arguments[i];
				if (1 === a.length && a[0].constructor && "Object" === Object.prototype.toString.call(a[0]).slice(8, -1) ? t = a[0] : [e, t] = a,
					t || (t = {}), t = g({}, t), e && !t.el && (t.el = e), t.el && d(t.el).length > 1) {
					const e = [];
					return d(t.el).each((s => {
						const a = g({}, t, {
							el: s
						});
						e.push(new V(a));
					})), e;
				}
				const r = this;
				r.__swiper__ = !0, r.support = E(), r.device = C({
					userAgent: t.userAgent
				}), r.browser = T(), r.eventsListeners = {}, r.eventsAnyListeners = [], r.modules = [...r.__modules__],
					t.modules && Array.isArray(t.modules) && r.modules.push(...t.modules);
				const n = {};
				r.modules.forEach((e => {
					e({
						swiper: r,
						extendParams: q(t, n),
						on: r.on.bind(r),
						once: r.once.bind(r),
						off: r.off.bind(r),
						emit: r.emit.bind(r)
					});
				}));
				const l = g({}, W, n);
				return r.params = g({}, l, _, t), r.originalParams = g({}, r.params), r.passedParams = g({}, t),
					r.params && r.params.on && Object.keys(r.params.on).forEach((e => {
						r.on(e, r.params.on[e]);
					})), r.params && r.params.onAny && r.onAny(r.params.onAny), r.$ = d, Object.assign(r, {
						enabled: r.params.enabled,
						el: e,
						classNames: [],
						slides: d(),
						slidesGrid: [],
						snapGrid: [],
						slidesSizesGrid: [],
						isHorizontal: () => "horizontal" === r.params.direction,
						isVertical: () => "vertical" === r.params.direction,
						activeIndex: 0,
						realIndex: 0,
						isBeginning: !0,
						isEnd: !1,
						translate: 0,
						previousTranslate: 0,
						progress: 0,
						velocity: 0,
						animating: !1,
						allowSlideNext: r.params.allowSlideNext,
						allowSlidePrev: r.params.allowSlidePrev,
						touchEvents: function () {
							const e = ["touchstart", "touchmove", "touchend", "touchcancel"], t = ["pointerdown", "pointermove", "pointerup"];
							return r.touchEventsTouch = {
								start: e[0],
								move: e[1],
								end: e[2],
								cancel: e[3]
							}, r.touchEventsDesktop = {
								start: t[0],
								move: t[1],
								end: t[2]
							}, r.support.touch || !r.params.simulateTouch ? r.touchEventsTouch : r.touchEventsDesktop;
						}(),
						touchEventsData: {
							isTouched: void 0,
							isMoved: void 0,
							allowTouchCallbacks: void 0,
							touchStartTime: void 0,
							isScrolling: void 0,
							currentTranslate: void 0,
							startTranslate: void 0,
							allowThresholdMove: void 0,
							focusableElements: r.params.focusableElements,
							lastClickTime: u(),
							clickTimeout: void 0,
							velocities: [],
							allowMomentumBounce: void 0,
							isTouchEvent: void 0,
							startMoving: void 0
						},
						allowClick: !0,
						allowTouchMove: r.params.allowTouchMove,
						touches: {
							startX: 0,
							startY: 0,
							currentX: 0,
							currentY: 0,
							diff: 0
						},
						imagesToLoad: [],
						imagesLoaded: 0
					}), r.emit("_swiper"), r.params.init && r.init(), r;
			}
			enable() {
				const e = this;
				e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
			}
			disable() {
				const e = this;
				e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
			}
			setProgress(e, t) {
				const s = this;
				e = Math.min(Math.max(e, 0), 1);
				const a = s.minTranslate(), i = (s.maxTranslate() - a) * e + a;
				s.translateTo(i, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses();
			}
			emitContainerClasses() {
				const e = this;
				if (!e.params._emitClasses || !e.el) return;
				const t = e.el.className.split(" ").filter((t => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
				e.emit("_containerClasses", t.join(" "));
			}
			getSlideClasses(e) {
				const t = this;
				return t.destroyed ? "" : e.className.split(" ").filter((e => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ");
			}
			emitSlidesClasses() {
				const e = this;
				if (!e.params._emitClasses || !e.el) return;
				const t = [];
				e.slides.each((s => {
					const a = e.getSlideClasses(s);
					t.push({
						slideEl: s,
						classNames: a
					}), e.emit("_slideClass", s, a);
				})), e.emit("_slideClasses", t);
			}
			slidesPerViewDynamic(e, t) {
				void 0 === e && (e = "current"), void 0 === t && (t = !1);
				const { params: s, slides: a, slidesGrid: i, slidesSizesGrid: r, size: n, activeIndex: l } = this;
				let o = 1;
				if (s.centeredSlides) {
					let e, t = a[l].swiperSlideSize;
					for (let s = l + 1; s < a.length; s += 1) a[s] && !e && (t += a[s].swiperSlideSize,
						o += 1, t > n && (e = !0));
					for (let s = l - 1; s >= 0; s -= 1) a[s] && !e && (t += a[s].swiperSlideSize, o += 1,
						t > n && (e = !0));
				} else if ("current" === e) for (let e = l + 1; e < a.length; e += 1) (t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1); else for (let e = l - 1; e >= 0; e -= 1) i[l] - i[e] < n && (o += 1);
				return o;
			}
			update() {
				const e = this;
				if (!e || e.destroyed) return;
				const { snapGrid: t, params: s } = e;
				function a() {
					const t = e.rtlTranslate ? -1 * e.translate : e.translate, s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
					e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
				}
				let i;
				s.breakpoints && e.setBreakpoint(), e.updateSize(), e.updateSlides(), e.updateProgress(),
					e.updateSlidesClasses(), e.params.freeMode && e.params.freeMode.enabled ? (a(),
						e.params.autoHeight && e.updateAutoHeight()) : (i = ("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0),
							i || a()), s.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
			}
			changeDirection(e, t) {
				void 0 === t && (t = !0);
				const s = this, a = s.params.direction;
				return e || (e = "horizontal" === a ? "vertical" : "horizontal"), e === a || "horizontal" !== e && "vertical" !== e || (s.$el.removeClass(`${s.params.containerModifierClass}${a}`).addClass(`${s.params.containerModifierClass}${e}`),
					s.emitContainerClasses(), s.params.direction = e, s.slides.each((t => {
						"vertical" === e ? t.style.width = "" : t.style.height = "";
					})), s.emit("changeDirection"), t && s.update()), s;
			}
			changeLanguageDirection(e) {
				const t = this;
				t.rtl && "rtl" === e || !t.rtl && "ltr" === e || (t.rtl = "rtl" === e, t.rtlTranslate = "horizontal" === t.params.direction && t.rtl,
					t.rtl ? (t.$el.addClass(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.$el.removeClass(`${t.params.containerModifierClass}rtl`),
						t.el.dir = "ltr"), t.update());
			}
			mount(e) {
				const t = this;
				if (t.mounted) return !0;
				const s = d(e || t.params.el);
				if (!(e = s[0])) return !1;
				e.swiper = t;
				const i = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
				let r = (() => {
					if (e && e.shadowRoot && e.shadowRoot.querySelector) {
						const t = d(e.shadowRoot.querySelector(i()));
						return t.children = e => s.children(e), t;
					}
					return s.children ? s.children(i()) : d(s).children(i());
				})();
				if (0 === r.length && t.params.createElements) {
					const e = a().createElement("div");
					r = d(e), e.className = t.params.wrapperClass, s.append(e), s.children(`.${t.params.slideClass}`).each((e => {
						r.append(e);
					}));
				}
				return Object.assign(t, {
					$el: s,
					el: e,
					$wrapperEl: r,
					wrapperEl: r[0],
					mounted: !0,
					rtl: "rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction"),
					rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction")),
					wrongRTL: "-webkit-box" === r.css("display")
				}), !0;
			}
			init(e) {
				const t = this;
				if (t.initialized) return t;
				return !1 === t.mount(e) || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(),
					t.addClasses(), t.params.loop && t.loopCreate(), t.updateSize(), t.updateSlides(),
					t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(),
					t.params.preloadImages && t.preloadImages(), t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
					t.attachEvents(), t.initialized = !0, t.emit("init"), t.emit("afterInit")), t;
			}
			destroy(e, t) {
				void 0 === e && (e = !0), void 0 === t && (t = !0);
				const s = this, { params: a, $el: i, $wrapperEl: r, slides: n } = s;
				return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"), s.initialized = !1,
					s.detachEvents(), a.loop && s.loopDestroy(), t && (s.removeClasses(), i.removeAttr("style"),
						r.removeAttr("style"), n && n.length && n.removeClass([a.slideVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),
					s.emit("destroy"), Object.keys(s.eventsListeners).forEach((e => {
						s.off(e);
					})), !1 !== e && (s.$el[0].swiper = null, function (e) {
						const t = e;
						Object.keys(t).forEach((e => {
							try {
								t[e] = null;
							} catch (e) { }
							try {
								delete t[e];
							} catch (e) { }
						}));
					}(s)), s.destroyed = !0), null;
			}
			static extendDefaults(e) {
				g(_, e);
			}
			static get extendedDefaults() {
				return _;
			}
			static get defaults() {
				return W;
			}
			static installModule(e) {
				V.prototype.__modules__ || (V.prototype.__modules__ = []);
				const t = V.prototype.__modules__;
				"function" == typeof e && t.indexOf(e) < 0 && t.push(e);
			}
			static use(e) {
				return Array.isArray(e) ? (e.forEach((e => V.installModule(e))), V) : (V.installModule(e),
					V);
			}
		}
		function F(e, t, s, i) {
			const r = a();
			return e.params.createElements && Object.keys(i).forEach((a => {
				if (!s[a] && !0 === s.auto) {
					let n = e.$el.children(`.${i[a]}`)[0];
					n || (n = r.createElement("div"), n.className = i[a], e.$el.append(n)), s[a] = n,
						t[a] = n;
				}
			})), s;
		}
		function U(e) {
			return void 0 === e && (e = ""), `.${e.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
		}
		function K(e) {
			const t = this, { $wrapperEl: s, params: a } = t;
			if (a.loop && t.loopDestroy(), "object" == typeof e && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && s.append(e[t]); else s.append(e);
			a.loop && t.loopCreate(), a.observer || t.update();
		}
		function Z(e) {
			const t = this, { params: s, $wrapperEl: a, activeIndex: i } = t;
			s.loop && t.loopDestroy();
			let r = i + 1;
			if ("object" == typeof e && "length" in e) {
				for (let t = 0; t < e.length; t += 1) e[t] && a.prepend(e[t]);
				r = i + e.length;
			} else a.prepend(e);
			s.loop && t.loopCreate(), s.observer || t.update(), t.slideTo(r, 0, !1);
		}
		function Q(e, t) {
			const s = this, { $wrapperEl: a, params: i, activeIndex: r } = s;
			let n = r;
			i.loop && (n -= s.loopedSlides, s.loopDestroy(), s.slides = a.children(`.${i.slideClass}`));
			const l = s.slides.length;
			if (e <= 0) return void s.prependSlide(t);
			if (e >= l) return void s.appendSlide(t);
			let o = n > e ? n + 1 : n;
			const d = [];
			for (let t = l - 1; t >= e; t -= 1) {
				const e = s.slides.eq(t);
				e.remove(), d.unshift(e);
			}
			if ("object" == typeof t && "length" in t) {
				for (let e = 0; e < t.length; e += 1) t[e] && a.append(t[e]);
				o = n > e ? n + t.length : n;
			} else a.append(t);
			for (let e = 0; e < d.length; e += 1) a.append(d[e]);
			i.loop && s.loopCreate(), i.observer || s.update(), i.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1);
		}
		function J(e) {
			const t = this, { params: s, $wrapperEl: a, activeIndex: i } = t;
			let r = i;
			s.loop && (r -= t.loopedSlides, t.loopDestroy(), t.slides = a.children(`.${s.slideClass}`));
			let n, l = r;
			if ("object" == typeof e && "length" in e) {
				for (let s = 0; s < e.length; s += 1) n = e[s], t.slides[n] && t.slides.eq(n).remove(),
					n < l && (l -= 1);
				l = Math.max(l, 0);
			} else n = e, t.slides[n] && t.slides.eq(n).remove(), n < l && (l -= 1), l = Math.max(l, 0);
			s.loop && t.loopCreate(), s.observer || t.update(), s.loop ? t.slideTo(l + t.loopedSlides, 0, !1) : t.slideTo(l, 0, !1);
		}
		function ee() {
			const e = this, t = [];
			for (let s = 0; s < e.slides.length; s += 1) t.push(s);
			e.removeSlide(t);
		}
		function te(e) {
			const { effect: t, swiper: s, on: a, setTranslate: i, setTransition: r, overwriteParams: n, perspective: l, recreateShadows: o, getEffectParams: d } = e;
			let c;
			a("beforeInit", (() => {
				if (s.params.effect !== t) return;
				s.classNames.push(`${s.params.containerModifierClass}${t}`), l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
				const e = n ? n() : {};
				Object.assign(s.params, e), Object.assign(s.originalParams, e);
			})), a("setTranslate", (() => {
				s.params.effect === t && i();
			})), a("setTransition", ((e, a) => {
				s.params.effect === t && r(a);
			})), a("transitionEnd", (() => {
				if (s.params.effect === t && o) {
					if (!d || !d().slideShadows) return;
					s.slides.each((e => {
						s.$(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
					})), o();
				}
			})), a("virtualUpdate", (() => {
				s.params.effect === t && (s.slides.length || (c = !0), requestAnimationFrame((() => {
					c && s.slides && s.slides.length && (i(), c = !1);
				})));
			}));
		}
		function se(e, t) {
			return e.transformEl ? t.find(e.transformEl).css({
				"backface-visibility": "hidden",
				"-webkit-backface-visibility": "hidden"
			}) : t;
		}
		function ae(e) {
			let { swiper: t, duration: s, transformEl: a, allSlides: i } = e;
			const { slides: r, activeIndex: n, $wrapperEl: l } = t;
			if (t.params.virtualTranslate && 0 !== s) {
				let e, s = !1;
				e = i ? a ? r.find(a) : r : a ? r.eq(n).find(a) : r.eq(n), e.transitionEnd((() => {
					if (s) return;
					if (!t || t.destroyed) return;
					s = !0, t.animating = !1;
					const e = ["webkitTransitionEnd", "transitionend"];
					for (let t = 0; t < e.length; t += 1) l.trigger(e[t]);
				}));
			}
		}
		function ie(e, t, s) {
			const a = "swiper-slide-shadow" + (s ? `-${s}` : ""), i = e.transformEl ? t.find(e.transformEl) : t;
			let r = i.children(`.${a}`);
			return r.length || (r = d(`<div class="swiper-slide-shadow${s ? `-${s}` : ""}"></div>`),
				i.append(r)), r;
		}
		Object.keys(j).forEach((e => {
			Object.keys(j[e]).forEach((t => {
				V.prototype[t] = j[e][t];
			}));
		})), V.use([function (e) {
			let { swiper: t, on: s, emit: a } = e;
			const i = r();
			let n = null, l = null;
			const o = () => {
				t && !t.destroyed && t.initialized && (a("beforeResize"), a("resize"));
			}, d = () => {
				t && !t.destroyed && t.initialized && a("orientationchange");
			};
			s("init", (() => {
				t.params.resizeObserver && void 0 !== i.ResizeObserver ? t && !t.destroyed && t.initialized && (n = new ResizeObserver((e => {
					l = i.requestAnimationFrame((() => {
						const { width: s, height: a } = t;
						let i = s, r = a;
						e.forEach((e => {
							let { contentBoxSize: s, contentRect: a, target: n } = e;
							n && n !== t.el || (i = a ? a.width : (s[0] || s).inlineSize, r = a ? a.height : (s[0] || s).blockSize);
						})), i === s && r === a || o();
					}));
				})), n.observe(t.el)) : (i.addEventListener("resize", o), i.addEventListener("orientationchange", d));
			})), s("destroy", (() => {
				l && i.cancelAnimationFrame(l), n && n.unobserve && t.el && (n.unobserve(t.el),
					n = null), i.removeEventListener("resize", o), i.removeEventListener("orientationchange", d);
			}));
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const n = [], l = r(), o = function (e, t) {
				void 0 === t && (t = {});
				const s = new (l.MutationObserver || l.WebkitMutationObserver)((e => {
					if (1 === e.length) return void i("observerUpdate", e[0]);
					const t = function () {
						i("observerUpdate", e[0]);
					};
					l.requestAnimationFrame ? l.requestAnimationFrame(t) : l.setTimeout(t, 0);
				}));
				s.observe(e, {
					attributes: void 0 === t.attributes || t.attributes,
					childList: void 0 === t.childList || t.childList,
					characterData: void 0 === t.characterData || t.characterData
				}), n.push(s);
			};
			s({
				observer: !1,
				observeParents: !1,
				observeSlideChildren: !1
			}), a("init", (() => {
				if (t.params.observer) {
					if (t.params.observeParents) {
						const e = t.$el.parents();
						for (let t = 0; t < e.length; t += 1) o(e[t]);
					}
					o(t.$el[0], {
						childList: t.params.observeSlideChildren
					}), o(t.$wrapperEl[0], {
						attributes: !1
					});
				}
			})), a("destroy", (() => {
				n.forEach((e => {
					e.disconnect();
				})), n.splice(0, n.length);
			}));
		}]);
		const re = [function (e) {
			let t, { swiper: s, extendParams: a, on: i, emit: r } = e;
			function n(e, t) {
				const a = s.params.virtual;
				if (a.cache && s.virtual.cache[t]) return s.virtual.cache[t];
				const i = a.renderSlide ? d(a.renderSlide.call(s, e, t)) : d(`<div class="${s.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`);
				return i.attr("data-swiper-slide-index") || i.attr("data-swiper-slide-index", t),
					a.cache && (s.virtual.cache[t] = i), i;
			}
			function l(e) {
				const { slidesPerView: t, slidesPerGroup: a, centeredSlides: i } = s.params, { addSlidesBefore: l, addSlidesAfter: o } = s.params.virtual, { from: d, to: c, slides: p, slidesGrid: u, offset: h } = s.virtual;
				s.params.cssMode || s.updateActiveIndex();
				const m = s.activeIndex || 0;
				let f, g, v;
				f = s.rtlTranslate ? "right" : s.isHorizontal() ? "left" : "top", i ? (g = Math.floor(t / 2) + a + o,
					v = Math.floor(t / 2) + a + l) : (g = t + (a - 1) + o, v = a + l);
				const w = Math.max((m || 0) - v, 0), b = Math.min((m || 0) + g, p.length - 1), x = (s.slidesGrid[w] || 0) - (s.slidesGrid[0] || 0);
				function y() {
					s.updateSlides(), s.updateProgress(), s.updateSlidesClasses(), s.lazy && s.params.lazy.enabled && s.lazy.load(),
						r("virtualUpdate");
				}
				if (Object.assign(s.virtual, {
					from: w,
					to: b,
					offset: x,
					slidesGrid: s.slidesGrid
				}), d === w && c === b && !e) return s.slidesGrid !== u && x !== h && s.slides.css(f, `${x}px`),
					s.updateProgress(), void r("virtualUpdate");
				if (s.params.virtual.renderExternal) return s.params.virtual.renderExternal.call(s, {
					offset: x,
					from: w,
					to: b,
					slides: function () {
						const e = [];
						for (let t = w; t <= b; t += 1) e.push(p[t]);
						return e;
					}()
				}), void (s.params.virtual.renderExternalUpdate ? y() : r("virtualUpdate"));
				const E = [], C = [];
				if (e) s.$wrapperEl.find(`.${s.params.slideClass}`).remove(); else for (let e = d; e <= c; e += 1) (e < w || e > b) && s.$wrapperEl.find(`.${s.params.slideClass}[data-swiper-slide-index="${e}"]`).remove();
				for (let t = 0; t < p.length; t += 1) t >= w && t <= b && (void 0 === c || e ? C.push(t) : (t > c && C.push(t),
					t < d && E.push(t)));
				C.forEach((e => {
					s.$wrapperEl.append(n(p[e], e));
				})), E.sort(((e, t) => t - e)).forEach((e => {
					s.$wrapperEl.prepend(n(p[e], e));
				})), s.$wrapperEl.children(".swiper-slide").css(f, `${x}px`), y();
			}
			a({
				virtual: {
					enabled: !1,
					slides: [],
					cache: !0,
					renderSlide: null,
					renderExternal: null,
					renderExternalUpdate: !0,
					addSlidesBefore: 0,
					addSlidesAfter: 0
				}
			}), s.virtual = {
				cache: {},
				from: void 0,
				to: void 0,
				slides: [],
				offset: 0,
				slidesGrid: []
			}, i("beforeInit", (() => {
				s.params.virtual.enabled && (s.virtual.slides = s.params.virtual.slides, s.classNames.push(`${s.params.containerModifierClass}virtual`),
					s.params.watchSlidesProgress = !0, s.originalParams.watchSlidesProgress = !0, s.params.initialSlide || l());
			})), i("setTranslate", (() => {
				s.params.virtual.enabled && (s.params.cssMode && !s._immediateVirtual ? (clearTimeout(t),
					t = setTimeout((() => {
						l();
					}), 100)) : l());
			})), i("init update resize", (() => {
				s.params.virtual.enabled && s.params.cssMode && v(s.wrapperEl, "--swiper-virtual-size", `${s.virtualSize}px`);
			})), Object.assign(s.virtual, {
				appendSlide: function (e) {
					if ("object" == typeof e && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.push(e[t]); else s.virtual.slides.push(e);
					l(!0);
				},
				prependSlide: function (e) {
					const t = s.activeIndex;
					let a = t + 1, i = 1;
					if (Array.isArray(e)) {
						for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.unshift(e[t]);
						a = t + e.length, i = e.length;
					} else s.virtual.slides.unshift(e);
					if (s.params.virtual.cache) {
						const e = s.virtual.cache, t = {};
						Object.keys(e).forEach((s => {
							const a = e[s], r = a.attr("data-swiper-slide-index");
							r && a.attr("data-swiper-slide-index", parseInt(r, 10) + i), t[parseInt(s, 10) + i] = a;
						})), s.virtual.cache = t;
					}
					l(!0), s.slideTo(a, 0);
				},
				removeSlide: function (e) {
					if (null == e) return;
					let t = s.activeIndex;
					if (Array.isArray(e)) for (let a = e.length - 1; a >= 0; a -= 1) s.virtual.slides.splice(e[a], 1),
						s.params.virtual.cache && delete s.virtual.cache[e[a]], e[a] < t && (t -= 1), t = Math.max(t, 0); else s.virtual.slides.splice(e, 1),
							s.params.virtual.cache && delete s.virtual.cache[e], e < t && (t -= 1), t = Math.max(t, 0);
					l(!0), s.slideTo(t, 0);
				},
				removeAllSlides: function () {
					s.virtual.slides = [], s.params.virtual.cache && (s.virtual.cache = {}), l(!0),
						s.slideTo(0, 0);
				},
				update: l
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: i, emit: n } = e;
			const l = a(), o = r();
			function c(e) {
				if (!t.enabled) return;
				const { rtlTranslate: s } = t;
				let a = e;
				a.originalEvent && (a = a.originalEvent);
				const i = a.keyCode || a.charCode, r = t.params.keyboard.pageUpDown, d = r && 33 === i, c = r && 34 === i, p = 37 === i, u = 39 === i, h = 38 === i, m = 40 === i;
				if (!t.allowSlideNext && (t.isHorizontal() && u || t.isVertical() && m || c)) return !1;
				if (!t.allowSlidePrev && (t.isHorizontal() && p || t.isVertical() && h || d)) return !1;
				if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || l.activeElement && l.activeElement.nodeName && ("input" === l.activeElement.nodeName.toLowerCase() || "textarea" === l.activeElement.nodeName.toLowerCase()))) {
					if (t.params.keyboard.onlyInViewport && (d || c || p || u || h || m)) {
						let e = !1;
						if (t.$el.parents(`.${t.params.slideClass}`).length > 0 && 0 === t.$el.parents(`.${t.params.slideActiveClass}`).length) return;
						const a = t.$el, i = a[0].clientWidth, r = a[0].clientHeight, n = o.innerWidth, l = o.innerHeight, d = t.$el.offset();
						s && (d.left -= t.$el[0].scrollLeft);
						const c = [[d.left, d.top], [d.left + i, d.top], [d.left, d.top + r], [d.left + i, d.top + r]];
						for (let t = 0; t < c.length; t += 1) {
							const s = c[t];
							if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
								if (0 === s[0] && 0 === s[1]) continue;
								e = !0;
							}
						}
						if (!e) return;
					}
					t.isHorizontal() ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1),
						((c || u) && !s || (d || p) && s) && t.slideNext(), ((d || p) && !s || (c || u) && s) && t.slidePrev()) : ((d || c || h || m) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1),
							(c || m) && t.slideNext(), (d || h) && t.slidePrev()), n("keyPress", i);
				}
			}
			function p() {
				t.keyboard.enabled || (d(l).on("keydown", c), t.keyboard.enabled = !0);
			}
			function u() {
				t.keyboard.enabled && (d(l).off("keydown", c), t.keyboard.enabled = !1);
			}
			t.keyboard = {
				enabled: !1
			}, s({
				keyboard: {
					enabled: !1,
					onlyInViewport: !0,
					pageUpDown: !0
				}
			}), i("init", (() => {
				t.params.keyboard.enabled && p();
			})), i("destroy", (() => {
				t.keyboard.enabled && u();
			})), Object.assign(t.keyboard, {
				enable: p,
				disable: u
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const n = r();
			let l;
			s({
				mousewheel: {
					enabled: !1,
					releaseOnEdges: !1,
					invert: !1,
					forceToAxis: !1,
					sensitivity: 1,
					eventsTarget: "container",
					thresholdDelta: null,
					thresholdTime: null
				}
			}), t.mousewheel = {
				enabled: !1
			};
			let o, c = u();
			const h = [];
			function m() {
				t.enabled && (t.mouseEntered = !0);
			}
			function f() {
				t.enabled && (t.mouseEntered = !1);
			}
			function g(e) {
				return !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) && !(t.params.mousewheel.thresholdTime && u() - c < t.params.mousewheel.thresholdTime) && (e.delta >= 6 && u() - c < 60 || (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(),
					i("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(),
						i("scroll", e.raw)), c = (new n.Date).getTime(), !1));
			}
			function v(e) {
				let s = e, a = !0;
				if (!t.enabled) return;
				const r = t.params.mousewheel;
				t.params.cssMode && s.preventDefault();
				let n = t.$el;
				if ("container" !== t.params.mousewheel.eventsTarget && (n = d(t.params.mousewheel.eventsTarget)),
					!t.mouseEntered && !n[0].contains(s.target) && !r.releaseOnEdges) return !0;
				s.originalEvent && (s = s.originalEvent);
				let c = 0;
				const m = t.rtlTranslate ? -1 : 1, f = function (e) {
					let t = 0, s = 0, a = 0, i = 0;
					return "detail" in e && (s = e.detail), "wheelDelta" in e && (s = -e.wheelDelta / 120),
						"wheelDeltaY" in e && (s = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120),
						"axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = s, s = 0), a = 10 * t, i = 10 * s,
						"deltaY" in e && (i = e.deltaY), "deltaX" in e && (a = e.deltaX), e.shiftKey && !a && (a = i,
							i = 0), (a || i) && e.deltaMode && (1 === e.deltaMode ? (a *= 40, i *= 40) : (a *= 800,
								i *= 800)), a && !t && (t = a < 1 ? -1 : 1), i && !s && (s = i < 1 ? -1 : 1), {
						spinX: t,
						spinY: s,
						pixelX: a,
						pixelY: i
					};
				}(s);
				if (r.forceToAxis) if (t.isHorizontal()) {
					if (!(Math.abs(f.pixelX) > Math.abs(f.pixelY))) return !0;
					c = -f.pixelX * m;
				} else {
					if (!(Math.abs(f.pixelY) > Math.abs(f.pixelX))) return !0;
					c = -f.pixelY;
				} else c = Math.abs(f.pixelX) > Math.abs(f.pixelY) ? -f.pixelX * m : -f.pixelY;
				if (0 === c) return !0;
				r.invert && (c = -c);
				let v = t.getTranslate() + c * r.sensitivity;
				if (v >= t.minTranslate() && (v = t.minTranslate()), v <= t.maxTranslate() && (v = t.maxTranslate()),
					a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate()), a && t.params.nested && s.stopPropagation(),
					t.params.freeMode && t.params.freeMode.enabled) {
					const e = {
						time: u(),
						delta: Math.abs(c),
						direction: Math.sign(c)
					}, a = o && e.time < o.time + 500 && e.delta <= o.delta && e.direction === o.direction;
					if (!a) {
						o = void 0, t.params.loop && t.loopFix();
						let n = t.getTranslate() + c * r.sensitivity;
						const d = t.isBeginning, u = t.isEnd;
						if (n >= t.minTranslate() && (n = t.minTranslate()), n <= t.maxTranslate() && (n = t.maxTranslate()),
							t.setTransition(0), t.setTranslate(n), t.updateProgress(), t.updateActiveIndex(),
							t.updateSlidesClasses(), (!d && t.isBeginning || !u && t.isEnd) && t.updateSlidesClasses(),
							t.params.freeMode.sticky) {
							clearTimeout(l), l = void 0, h.length >= 15 && h.shift();
							const s = h.length ? h[h.length - 1] : void 0, a = h[0];
							if (h.push(e), s && (e.delta > s.delta || e.direction !== s.direction)) h.splice(0); else if (h.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
								const s = c > 0 ? .8 : .2;
								o = e, h.splice(0), l = p((() => {
									t.slideToClosest(t.params.speed, !0, void 0, s);
								}), 0);
							}
							l || (l = p((() => {
								o = e, h.splice(0), t.slideToClosest(t.params.speed, !0, void 0, .5);
							}), 500));
						}
						if (a || i("scroll", s), t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(),
							n === t.minTranslate() || n === t.maxTranslate()) return !0;
					}
				} else {
					const s = {
						time: u(),
						delta: Math.abs(c),
						direction: Math.sign(c),
						raw: e
					};
					h.length >= 2 && h.shift();
					const a = h.length ? h[h.length - 1] : void 0;
					if (h.push(s), a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && g(s) : g(s),
						function (e) {
							const s = t.params.mousewheel;
							if (e.direction < 0) {
								if (t.isEnd && !t.params.loop && s.releaseOnEdges) return !0;
							} else if (t.isBeginning && !t.params.loop && s.releaseOnEdges) return !0;
							return !1;
						}(s)) return !0;
				}
				return s.preventDefault ? s.preventDefault() : s.returnValue = !1, !1;
			}
			function w(e) {
				let s = t.$el;
				"container" !== t.params.mousewheel.eventsTarget && (s = d(t.params.mousewheel.eventsTarget)),
					s[e]("mouseenter", m), s[e]("mouseleave", f), s[e]("wheel", v);
			}
			function b() {
				return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", v), !0) : !t.mousewheel.enabled && (w("on"),
					t.mousewheel.enabled = !0, !0);
			}
			function x() {
				return t.params.cssMode ? (t.wrapperEl.addEventListener(event, v), !0) : !!t.mousewheel.enabled && (w("off"),
					t.mousewheel.enabled = !1, !0);
			}
			a("init", (() => {
				!t.params.mousewheel.enabled && t.params.cssMode && x(), t.params.mousewheel.enabled && b();
			})), a("destroy", (() => {
				t.params.cssMode && b(), t.mousewheel.enabled && x();
			})), Object.assign(t.mousewheel, {
				enable: b,
				disable: x
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			function r(e) {
				let s;
				return e && (s = d(e), t.params.uniqueNavElements && "string" == typeof e && s.length > 1 && 1 === t.$el.find(e).length && (s = t.$el.find(e))),
					s;
			}
			function n(e, s) {
				const a = t.params.navigation;
				e && e.length > 0 && (e[s ? "addClass" : "removeClass"](a.disabledClass), e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = s),
					t.params.watchOverflow && t.enabled && e[t.isLocked ? "addClass" : "removeClass"](a.lockClass));
			}
			function l() {
				if (t.params.loop) return;
				const { $nextEl: e, $prevEl: s } = t.navigation;
				n(s, t.isBeginning && !t.params.rewind), n(e, t.isEnd && !t.params.rewind);
			}
			function o(e) {
				e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(),
					i("navigationPrev"));
			}
			function c(e) {
				e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(),
					i("navigationNext"));
			}
			function p() {
				const e = t.params.navigation;
				if (t.params.navigation = F(t, t.originalParams.navigation, t.params.navigation, {
					nextEl: "swiper-button-next",
					prevEl: "swiper-button-prev"
				}), !e.nextEl && !e.prevEl) return;
				const s = r(e.nextEl), a = r(e.prevEl);
				s && s.length > 0 && s.on("click", c), a && a.length > 0 && a.on("click", o), Object.assign(t.navigation, {
					$nextEl: s,
					nextEl: s && s[0],
					$prevEl: a,
					prevEl: a && a[0]
				}), t.enabled || (s && s.addClass(e.lockClass), a && a.addClass(e.lockClass));
			}
			function u() {
				const { $nextEl: e, $prevEl: s } = t.navigation;
				e && e.length && (e.off("click", c), e.removeClass(t.params.navigation.disabledClass)),
					s && s.length && (s.off("click", o), s.removeClass(t.params.navigation.disabledClass));
			}
			s({
				navigation: {
					nextEl: null,
					prevEl: null,
					hideOnClick: !1,
					disabledClass: "swiper-button-disabled",
					hiddenClass: "swiper-button-hidden",
					lockClass: "swiper-button-lock",
					navigationDisabledClass: "swiper-navigation-disabled"
				}
			}), t.navigation = {
				nextEl: null,
				$nextEl: null,
				prevEl: null,
				$prevEl: null
			}, a("init", (() => {
				!1 === t.params.navigation.enabled ? h() : (p(), l());
			})), a("toEdge fromEdge lock unlock", (() => {
				l();
			})), a("destroy", (() => {
				u();
			})), a("enable disable", (() => {
				const { $nextEl: e, $prevEl: s } = t.navigation;
				e && e[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass), s && s[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass);
			})), a("click", ((e, s) => {
				const { $nextEl: a, $prevEl: r } = t.navigation, n = s.target;
				if (t.params.navigation.hideOnClick && !d(n).is(r) && !d(n).is(a)) {
					if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === n || t.pagination.el.contains(n))) return;
					let e;
					a ? e = a.hasClass(t.params.navigation.hiddenClass) : r && (e = r.hasClass(t.params.navigation.hiddenClass)),
						i(!0 === e ? "navigationShow" : "navigationHide"), a && a.toggleClass(t.params.navigation.hiddenClass),
						r && r.toggleClass(t.params.navigation.hiddenClass);
				}
			}));
			const h = () => {
				t.$el.addClass(t.params.navigation.navigationDisabledClass), u();
			};
			Object.assign(t.navigation, {
				enable: () => {
					t.$el.removeClass(t.params.navigation.navigationDisabledClass), p(), l();
				},
				disable: h,
				update: l,
				init: p,
				destroy: u
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const r = "swiper-pagination";
			let n;
			s({
				pagination: {
					el: null,
					bulletElement: "span",
					clickable: !1,
					hideOnClick: !1,
					renderBullet: null,
					renderProgressbar: null,
					renderFraction: null,
					renderCustom: null,
					progressbarOpposite: !1,
					type: "bullets",
					dynamicBullets: !1,
					dynamicMainBullets: 1,
					formatFractionCurrent: e => e,
					formatFractionTotal: e => e,
					bulletClass: `${r}-bullet`,
					bulletActiveClass: `${r}-bullet-active`,
					modifierClass: `${r}-`,
					currentClass: `${r}-current`,
					totalClass: `${r}-total`,
					hiddenClass: `${r}-hidden`,
					progressbarFillClass: `${r}-progressbar-fill`,
					progressbarOppositeClass: `${r}-progressbar-opposite`,
					clickableClass: `${r}-clickable`,
					lockClass: `${r}-lock`,
					horizontalClass: `${r}-horizontal`,
					verticalClass: `${r}-vertical`,
					paginationDisabledClass: `${r}-disabled`
				}
			}), t.pagination = {
				el: null,
				$el: null,
				bullets: []
			};
			let l = 0;
			function o() {
				return !t.params.pagination.el || !t.pagination.el || !t.pagination.$el || 0 === t.pagination.$el.length;
			}
			function c(e, s) {
				const { bulletActiveClass: a } = t.params.pagination;
				e[s]().addClass(`${a}-${s}`)[s]().addClass(`${a}-${s}-${s}`);
			}
			function p() {
				const e = t.rtl, s = t.params.pagination;
				if (o()) return;
				const a = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, r = t.pagination.$el;
				let p;
				const u = t.params.loop ? Math.ceil((a - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
				if (t.params.loop ? (p = Math.ceil((t.activeIndex - t.loopedSlides) / t.params.slidesPerGroup),
					p > a - 1 - 2 * t.loopedSlides && (p -= a - 2 * t.loopedSlides), p > u - 1 && (p -= u),
					p < 0 && "bullets" !== t.params.paginationType && (p = u + p)) : p = void 0 !== t.snapIndex ? t.snapIndex : t.activeIndex || 0,
					"bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0) {
					const a = t.pagination.bullets;
					let i, o, u;
					if (s.dynamicBullets && (n = a.eq(0)[t.isHorizontal() ? "outerWidth" : "outerHeight"](!0),
						r.css(t.isHorizontal() ? "width" : "height", n * (s.dynamicMainBullets + 4) + "px"),
						s.dynamicMainBullets > 1 && void 0 !== t.previousIndex && (l += p - (t.previousIndex - t.loopedSlides || 0),
							l > s.dynamicMainBullets - 1 ? l = s.dynamicMainBullets - 1 : l < 0 && (l = 0)),
						i = Math.max(p - l, 0), o = i + (Math.min(a.length, s.dynamicMainBullets) - 1),
						u = (o + i) / 2), a.removeClass(["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e => `${s.bulletActiveClass}${e}`)).join(" ")),
						r.length > 1) a.each((e => {
							const t = d(e), a = t.index();
							a === p && t.addClass(s.bulletActiveClass), s.dynamicBullets && (a >= i && a <= o && t.addClass(`${s.bulletActiveClass}-main`),
								a === i && c(t, "prev"), a === o && c(t, "next"));
						})); else {
						const e = a.eq(p), r = e.index();
						if (e.addClass(s.bulletActiveClass), s.dynamicBullets) {
							const e = a.eq(i), n = a.eq(o);
							for (let e = i; e <= o; e += 1) a.eq(e).addClass(`${s.bulletActiveClass}-main`);
							if (t.params.loop) if (r >= a.length) {
								for (let e = s.dynamicMainBullets; e >= 0; e -= 1) a.eq(a.length - e).addClass(`${s.bulletActiveClass}-main`);
								a.eq(a.length - s.dynamicMainBullets - 1).addClass(`${s.bulletActiveClass}-prev`);
							} else c(e, "prev"), c(n, "next"); else c(e, "prev"), c(n, "next");
						}
					}
					if (s.dynamicBullets) {
						const i = Math.min(a.length, s.dynamicMainBullets + 4), r = (n * i - n) / 2 - u * n, l = e ? "right" : "left";
						a.css(t.isHorizontal() ? l : "top", `${r}px`);
					}
				}
				if ("fraction" === s.type && (r.find(U(s.currentClass)).text(s.formatFractionCurrent(p + 1)),
					r.find(U(s.totalClass)).text(s.formatFractionTotal(u))), "progressbar" === s.type) {
					let e;
					e = s.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
					const a = (p + 1) / u;
					let i = 1, n = 1;
					"horizontal" === e ? i = a : n = a, r.find(U(s.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${i}) scaleY(${n})`).transition(t.params.speed);
				}
				"custom" === s.type && s.renderCustom ? (r.html(s.renderCustom(t, p + 1, u)), i("paginationRender", r[0])) : i("paginationUpdate", r[0]),
					t.params.watchOverflow && t.enabled && r[t.isLocked ? "addClass" : "removeClass"](s.lockClass);
			}
			function u() {
				const e = t.params.pagination;
				if (o()) return;
				const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, a = t.pagination.$el;
				let r = "";
				if ("bullets" === e.type) {
					let i = t.params.loop ? Math.ceil((s - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
					t.params.freeMode && t.params.freeMode.enabled && !t.params.loop && i > s && (i = s);
					for (let s = 0; s < i; s += 1) e.renderBullet ? r += e.renderBullet.call(t, s, e.bulletClass) : r += `<${e.bulletElement} class="${e.bulletClass}"></${e.bulletElement}>`;
					a.html(r), t.pagination.bullets = a.find(U(e.bulletClass));
				}
				"fraction" === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`,
					a.html(r)), "progressbar" === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`,
						a.html(r)), "custom" !== e.type && i("paginationRender", t.pagination.$el[0]);
			}
			function h() {
				t.params.pagination = F(t, t.originalParams.pagination, t.params.pagination, {
					el: "swiper-pagination"
				});
				const e = t.params.pagination;
				if (!e.el) return;
				let s = d(e.el);
				0 !== s.length && (t.params.uniqueNavElements && "string" == typeof e.el && s.length > 1 && (s = t.$el.find(e.el),
					s.length > 1 && (s = s.filter((e => d(e).parents(".swiper")[0] === t.el)))), "bullets" === e.type && e.clickable && s.addClass(e.clickableClass),
					s.addClass(e.modifierClass + e.type), s.addClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
					"bullets" === e.type && e.dynamicBullets && (s.addClass(`${e.modifierClass}${e.type}-dynamic`),
						l = 0, e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)), "progressbar" === e.type && e.progressbarOpposite && s.addClass(e.progressbarOppositeClass),
					e.clickable && s.on("click", U(e.bulletClass), (function (e) {
						e.preventDefault();
						let s = d(this).index() * t.params.slidesPerGroup;
						t.params.loop && (s += t.loopedSlides), t.slideTo(s);
					})), Object.assign(t.pagination, {
						$el: s,
						el: s[0]
					}), t.enabled || s.addClass(e.lockClass));
			}
			function m() {
				const e = t.params.pagination;
				if (o()) return;
				const s = t.pagination.$el;
				s.removeClass(e.hiddenClass), s.removeClass(e.modifierClass + e.type), s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
					t.pagination.bullets && t.pagination.bullets.removeClass && t.pagination.bullets.removeClass(e.bulletActiveClass),
					e.clickable && s.off("click", U(e.bulletClass));
			}
			a("init", (() => {
				!1 === t.params.pagination.enabled ? f() : (h(), u(), p());
			})), a("activeIndexChange", (() => {
				(t.params.loop || void 0 === t.snapIndex) && p();
			})), a("snapIndexChange", (() => {
				t.params.loop || p();
			})), a("slidesLengthChange", (() => {
				t.params.loop && (u(), p());
			})), a("snapGridLengthChange", (() => {
				t.params.loop || (u(), p());
			})), a("destroy", (() => {
				m();
			})), a("enable disable", (() => {
				const { $el: e } = t.pagination;
				e && e[t.enabled ? "removeClass" : "addClass"](t.params.pagination.lockClass);
			})), a("lock unlock", (() => {
				p();
			})), a("click", ((e, s) => {
				const a = s.target, { $el: r } = t.pagination;
				if (t.params.pagination.el && t.params.pagination.hideOnClick && r && r.length > 0 && !d(a).hasClass(t.params.pagination.bulletClass)) {
					if (t.navigation && (t.navigation.nextEl && a === t.navigation.nextEl || t.navigation.prevEl && a === t.navigation.prevEl)) return;
					const e = r.hasClass(t.params.pagination.hiddenClass);
					i(!0 === e ? "paginationShow" : "paginationHide"), r.toggleClass(t.params.pagination.hiddenClass);
				}
			}));
			const f = () => {
				t.$el.addClass(t.params.pagination.paginationDisabledClass), t.pagination.$el && t.pagination.$el.addClass(t.params.pagination.paginationDisabledClass),
					m();
			};
			Object.assign(t.pagination, {
				enable: () => {
					t.$el.removeClass(t.params.pagination.paginationDisabledClass), t.pagination.$el && t.pagination.$el.removeClass(t.params.pagination.paginationDisabledClass),
						h(), u(), p();
				},
				disable: f,
				render: u,
				update: p,
				init: h,
				destroy: m
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: i, emit: r } = e;
			const n = a();
			let l, o, c, u, h = !1, m = null, f = null;
			function g() {
				if (!t.params.scrollbar.el || !t.scrollbar.el) return;
				const { scrollbar: e, rtlTranslate: s, progress: a } = t, { $dragEl: i, $el: r } = e, n = t.params.scrollbar;
				let l = o, d = (c - o) * a;
				s ? (d = -d, d > 0 ? (l = o - d, d = 0) : -d + o > c && (l = c + d)) : d < 0 ? (l = o + d,
					d = 0) : d + o > c && (l = c - d), t.isHorizontal() ? (i.transform(`translate3d(${d}px, 0, 0)`),
						i[0].style.width = `${l}px`) : (i.transform(`translate3d(0px, ${d}px, 0)`), i[0].style.height = `${l}px`),
					n.hide && (clearTimeout(m), r[0].style.opacity = 1, m = setTimeout((() => {
						r[0].style.opacity = 0, r.transition(400);
					}), 1e3));
			}
			function v() {
				if (!t.params.scrollbar.el || !t.scrollbar.el) return;
				const { scrollbar: e } = t, { $dragEl: s, $el: a } = e;
				s[0].style.width = "", s[0].style.height = "", c = t.isHorizontal() ? a[0].offsetWidth : a[0].offsetHeight,
					u = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0)),
					o = "auto" === t.params.scrollbar.dragSize ? c * u : parseInt(t.params.scrollbar.dragSize, 10),
					t.isHorizontal() ? s[0].style.width = `${o}px` : s[0].style.height = `${o}px`, a[0].style.display = u >= 1 ? "none" : "",
					t.params.scrollbar.hide && (a[0].style.opacity = 0), t.params.watchOverflow && t.enabled && e.$el[t.isLocked ? "addClass" : "removeClass"](t.params.scrollbar.lockClass);
			}
			function w(e) {
				return t.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY;
			}
			function b(e) {
				const { scrollbar: s, rtlTranslate: a } = t, { $el: i } = s;
				let r;
				r = (w(e) - i.offset()[t.isHorizontal() ? "left" : "top"] - (null !== l ? l : o / 2)) / (c - o),
					r = Math.max(Math.min(r, 1), 0), a && (r = 1 - r);
				const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
				t.updateProgress(n), t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses();
			}
			function x(e) {
				const s = t.params.scrollbar, { scrollbar: a, $wrapperEl: i } = t, { $el: n, $dragEl: o } = a;
				h = !0, l = e.target === o[0] || e.target === o ? w(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null,
					e.preventDefault(), e.stopPropagation(), i.transition(100), o.transition(100), b(e),
					clearTimeout(f), n.transition(0), s.hide && n.css("opacity", 1), t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"),
					r("scrollbarDragStart", e);
			}
			function y(e) {
				const { scrollbar: s, $wrapperEl: a } = t, { $el: i, $dragEl: n } = s;
				h && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, b(e), a.transition(0),
					i.transition(0), n.transition(0), r("scrollbarDragMove", e));
			}
			function E(e) {
				const s = t.params.scrollbar, { scrollbar: a, $wrapperEl: i } = t, { $el: n } = a;
				h && (h = !1, t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""), i.transition("")),
					s.hide && (clearTimeout(f), f = p((() => {
						n.css("opacity", 0), n.transition(400);
					}), 1e3)), r("scrollbarDragEnd", e), s.snapOnRelease && t.slideToClosest());
			}
			function C(e) {
				const { scrollbar: s, touchEventsTouch: a, touchEventsDesktop: i, params: r, support: l } = t, o = s.$el;
				if (!o) return;
				const d = o[0], c = !(!l.passiveListener || !r.passiveListeners) && {
					passive: !1,
					capture: !1
				}, p = !(!l.passiveListener || !r.passiveListeners) && {
					passive: !0,
					capture: !1
				};
				if (!d) return;
				const u = "on" === e ? "addEventListener" : "removeEventListener";
				l.touch ? (d[u](a.start, x, c), d[u](a.move, y, c), d[u](a.end, E, p)) : (d[u](i.start, x, c),
					n[u](i.move, y, c), n[u](i.end, E, p));
			}
			function T() {
				const { scrollbar: e, $el: s } = t;
				t.params.scrollbar = F(t, t.originalParams.scrollbar, t.params.scrollbar, {
					el: "swiper-scrollbar"
				});
				const a = t.params.scrollbar;
				if (!a.el) return;
				let i = d(a.el);
				t.params.uniqueNavElements && "string" == typeof a.el && i.length > 1 && 1 === s.find(a.el).length && (i = s.find(a.el)),
					i.addClass(t.isHorizontal() ? a.horizontalClass : a.verticalClass);
				let r = i.find(`.${t.params.scrollbar.dragClass}`);
				0 === r.length && (r = d(`<div class="${t.params.scrollbar.dragClass}"></div>`),
					i.append(r)), Object.assign(e, {
						$el: i,
						el: i[0],
						$dragEl: r,
						dragEl: r[0]
					}), a.draggable && t.params.scrollbar.el && t.scrollbar.el && C("on"), i && i[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
			}
			function $() {
				const e = t.params.scrollbar, s = t.scrollbar.$el;
				s && s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass), t.params.scrollbar.el && t.scrollbar.el && C("off");
			}
			s({
				scrollbar: {
					el: null,
					dragSize: "auto",
					hide: !1,
					draggable: !1,
					snapOnRelease: !0,
					lockClass: "swiper-scrollbar-lock",
					dragClass: "swiper-scrollbar-drag",
					scrollbarDisabledClass: "swiper-scrollbar-disabled",
					horizontalClass: "swiper-scrollbar-horizontal",
					verticalClass: "swiper-scrollbar-vertical"
				}
			}), t.scrollbar = {
				el: null,
				dragEl: null,
				$el: null,
				$dragEl: null
			}, i("init", (() => {
				!1 === t.params.scrollbar.enabled ? S() : (T(), v(), g());
			})), i("update resize observerUpdate lock unlock", (() => {
				v();
			})), i("setTranslate", (() => {
				g();
			})), i("setTransition", ((e, s) => {
				!function (e) {
					t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e);
				}(s);
			})), i("enable disable", (() => {
				const { $el: e } = t.scrollbar;
				e && e[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
			})), i("destroy", (() => {
				$();
			}));
			const S = () => {
				t.$el.addClass(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.$el && t.scrollbar.$el.addClass(t.params.scrollbar.scrollbarDisabledClass),
					$();
			};
			Object.assign(t.scrollbar, {
				enable: () => {
					t.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.$el && t.scrollbar.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass),
						T(), v(), g();
				},
				disable: S,
				updateSize: v,
				setTranslate: g,
				init: T,
				destroy: $
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				parallax: {
					enabled: !1
				}
			});
			const i = (e, s) => {
				const { rtl: a } = t, i = d(e), r = a ? -1 : 1, n = i.attr("data-swiper-parallax") || "0";
				let l = i.attr("data-swiper-parallax-x"), o = i.attr("data-swiper-parallax-y");
				const c = i.attr("data-swiper-parallax-scale"), p = i.attr("data-swiper-parallax-opacity");
				if (l || o ? (l = l || "0", o = o || "0") : t.isHorizontal() ? (l = n, o = "0") : (o = n,
					l = "0"), l = l.indexOf("%") >= 0 ? parseInt(l, 10) * s * r + "%" : l * s * r + "px",
					o = o.indexOf("%") >= 0 ? parseInt(o, 10) * s + "%" : o * s + "px", null != p) {
					const e = p - (p - 1) * (1 - Math.abs(s));
					i[0].style.opacity = e;
				}
				if (null == c) i.transform(`translate3d(${l}, ${o}, 0px)`); else {
					const e = c - (c - 1) * (1 - Math.abs(s));
					i.transform(`translate3d(${l}, ${o}, 0px) scale(${e})`);
				}
			}, r = () => {
				const { $el: e, slides: s, progress: a, snapGrid: r } = t;
				e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e => {
					i(e, a);
				})), s.each(((e, s) => {
					let n = e.progress;
					t.params.slidesPerGroup > 1 && "auto" !== t.params.slidesPerView && (n += Math.ceil(s / 2) - a * (r.length - 1)),
						n = Math.min(Math.max(n, -1), 1), d(e).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e => {
							i(e, n);
						}));
				}));
			};
			a("beforeInit", (() => {
				t.params.parallax.enabled && (t.params.watchSlidesProgress = !0, t.originalParams.watchSlidesProgress = !0);
			})), a("init", (() => {
				t.params.parallax.enabled && r();
			})), a("setTranslate", (() => {
				t.params.parallax.enabled && r();
			})), a("setTransition", ((e, s) => {
				t.params.parallax.enabled && function (e) {
					void 0 === e && (e = t.params.speed);
					const { $el: s } = t;
					s.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((t => {
						const s = d(t);
						let a = parseInt(s.attr("data-swiper-parallax-duration"), 10) || e;
						0 === e && (a = 0), s.transition(a);
					}));
				}(s);
			}));
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const n = r();
			s({
				zoom: {
					enabled: !1,
					maxRatio: 3,
					minRatio: 1,
					toggle: !0,
					containerClass: "swiper-zoom-container",
					zoomedSlideClass: "swiper-slide-zoomed"
				}
			}), t.zoom = {
				enabled: !1
			};
			let l, o, c, p = 1, u = !1;
			const m = {
				$slideEl: void 0,
				slideWidth: void 0,
				slideHeight: void 0,
				$imageEl: void 0,
				$imageWrapEl: void 0,
				maxRatio: 3
			}, f = {
				isTouched: void 0,
				isMoved: void 0,
				currentX: void 0,
				currentY: void 0,
				minX: void 0,
				minY: void 0,
				maxX: void 0,
				maxY: void 0,
				width: void 0,
				height: void 0,
				startX: void 0,
				startY: void 0,
				touchesStart: {},
				touchesCurrent: {}
			}, g = {
				x: void 0,
				y: void 0,
				prevPositionX: void 0,
				prevPositionY: void 0,
				prevTime: void 0
			};
			let v = 1;
			function w(e) {
				if (e.targetTouches.length < 2) return 1;
				const t = e.targetTouches[0].pageX, s = e.targetTouches[0].pageY, a = e.targetTouches[1].pageX, i = e.targetTouches[1].pageY;
				return Math.sqrt((a - t) ** 2 + (i - s) ** 2);
			}
			function b(e) {
				const s = t.support, a = t.params.zoom;
				if (o = !1, c = !1, !s.gestures) {
					if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
					o = !0, m.scaleStart = w(e);
				}
				m.$slideEl && m.$slideEl.length || (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`),
					0 === m.$slideEl.length && (m.$slideEl = t.slides.eq(t.activeIndex)), m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
					m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`), m.maxRatio = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio,
					0 !== m.$imageWrapEl.length) ? (m.$imageEl && m.$imageEl.transition(0), u = !0) : m.$imageEl = void 0;
			}
			function x(e) {
				const s = t.support, a = t.params.zoom, i = t.zoom;
				if (!s.gestures) {
					if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
					c = !0, m.scaleMove = w(e);
				}
				m.$imageEl && 0 !== m.$imageEl.length ? (s.gestures ? i.scale = e.scale * p : i.scale = m.scaleMove / m.scaleStart * p,
					i.scale > m.maxRatio && (i.scale = m.maxRatio - 1 + (i.scale - m.maxRatio + 1) ** .5),
					i.scale < a.minRatio && (i.scale = a.minRatio + 1 - (a.minRatio - i.scale + 1) ** .5),
					m.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`)) : "gesturechange" === e.type && b(e);
			}
			function y(e) {
				const s = t.device, a = t.support, i = t.params.zoom, r = t.zoom;
				if (!a.gestures) {
					if (!o || !c) return;
					if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !s.android) return;
					o = !1, c = !1;
				}
				m.$imageEl && 0 !== m.$imageEl.length && (r.scale = Math.max(Math.min(r.scale, m.maxRatio), i.minRatio),
					m.$imageEl.transition(t.params.speed).transform(`translate3d(0,0,0) scale(${r.scale})`),
					p = r.scale, u = !1, 1 === r.scale && (m.$slideEl = void 0));
			}
			function E(e) {
				const s = t.zoom;
				if (!m.$imageEl || 0 === m.$imageEl.length) return;
				if (t.allowClick = !1, !f.isTouched || !m.$slideEl) return;
				f.isMoved || (f.width = m.$imageEl[0].offsetWidth, f.height = m.$imageEl[0].offsetHeight,
					f.startX = h(m.$imageWrapEl[0], "x") || 0, f.startY = h(m.$imageWrapEl[0], "y") || 0,
					m.slideWidth = m.$slideEl[0].offsetWidth, m.slideHeight = m.$slideEl[0].offsetHeight,
					m.$imageWrapEl.transition(0));
				const a = f.width * s.scale, i = f.height * s.scale;
				if (!(a < m.slideWidth && i < m.slideHeight)) {
					if (f.minX = Math.min(m.slideWidth / 2 - a / 2, 0), f.maxX = -f.minX, f.minY = Math.min(m.slideHeight / 2 - i / 2, 0),
						f.maxY = -f.minY, f.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
						f.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
						!f.isMoved && !u) {
						if (t.isHorizontal() && (Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x || Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x)) return void (f.isTouched = !1);
						if (!t.isHorizontal() && (Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y || Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y)) return void (f.isTouched = !1);
					}
					e.cancelable && e.preventDefault(), e.stopPropagation(), f.isMoved = !0, f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX,
						f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY, f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** .8),
						f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** .8),
						f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** .8),
						f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** .8),
						g.prevPositionX || (g.prevPositionX = f.touchesCurrent.x), g.prevPositionY || (g.prevPositionY = f.touchesCurrent.y),
						g.prevTime || (g.prevTime = Date.now()), g.x = (f.touchesCurrent.x - g.prevPositionX) / (Date.now() - g.prevTime) / 2,
						g.y = (f.touchesCurrent.y - g.prevPositionY) / (Date.now() - g.prevTime) / 2, Math.abs(f.touchesCurrent.x - g.prevPositionX) < 2 && (g.x = 0),
						Math.abs(f.touchesCurrent.y - g.prevPositionY) < 2 && (g.y = 0), g.prevPositionX = f.touchesCurrent.x,
						g.prevPositionY = f.touchesCurrent.y, g.prevTime = Date.now(), m.$imageWrapEl.transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
				}
			}
			function C() {
				const e = t.zoom;
				m.$slideEl && t.previousIndex !== t.activeIndex && (m.$imageEl && m.$imageEl.transform("translate3d(0,0,0) scale(1)"),
					m.$imageWrapEl && m.$imageWrapEl.transform("translate3d(0,0,0)"), e.scale = 1, p = 1,
					m.$slideEl = void 0, m.$imageEl = void 0, m.$imageWrapEl = void 0);
			}
			function T(e) {
				const s = t.zoom, a = t.params.zoom;
				if (m.$slideEl || (e && e.target && (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`)),
					m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex)),
					m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
					m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`)), !m.$imageEl || 0 === m.$imageEl.length || !m.$imageWrapEl || 0 === m.$imageWrapEl.length) return;
				let i, r, l, o, c, u, h, g, v, w, b, x, y, E, C, T, $, S;
				t.params.cssMode && (t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.touchAction = "none"),
					m.$slideEl.addClass(`${a.zoomedSlideClass}`), void 0 === f.touchesStart.x && e ? (i = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX,
						r = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (i = f.touchesStart.x,
							r = f.touchesStart.y), s.scale = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio,
					p = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio, e ? ($ = m.$slideEl[0].offsetWidth,
						S = m.$slideEl[0].offsetHeight, l = m.$slideEl.offset().left + n.scrollX, o = m.$slideEl.offset().top + n.scrollY,
						c = l + $ / 2 - i, u = o + S / 2 - r, v = m.$imageEl[0].offsetWidth, w = m.$imageEl[0].offsetHeight,
						b = v * s.scale, x = w * s.scale, y = Math.min($ / 2 - b / 2, 0), E = Math.min(S / 2 - x / 2, 0),
						C = -y, T = -E, h = c * s.scale, g = u * s.scale, h < y && (h = y), h > C && (h = C),
						g < E && (g = E), g > T && (g = T)) : (h = 0, g = 0), m.$imageWrapEl.transition(300).transform(`translate3d(${h}px, ${g}px,0)`),
					m.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${s.scale})`);
			}
			function $() {
				const e = t.zoom, s = t.params.zoom;
				m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex),
					m.$imageEl = m.$slideEl.find(`.${s.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
					m.$imageWrapEl = m.$imageEl.parent(`.${s.containerClass}`)), m.$imageEl && 0 !== m.$imageEl.length && m.$imageWrapEl && 0 !== m.$imageWrapEl.length && (t.params.cssMode && (t.wrapperEl.style.overflow = "",
						t.wrapperEl.style.touchAction = ""), e.scale = 1, p = 1, m.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
						m.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), m.$slideEl.removeClass(`${s.zoomedSlideClass}`),
						m.$slideEl = void 0);
			}
			function S(e) {
				const s = t.zoom;
				s.scale && 1 !== s.scale ? $() : T(e);
			}
			function M() {
				const e = t.support;
				return {
					passiveListener: !("touchstart" !== t.touchEvents.start || !e.passiveListener || !t.params.passiveListeners) && {
						passive: !0,
						capture: !1
					},
					activeListenerWithCapture: !e.passiveListener || {
						passive: !1,
						capture: !0
					}
				};
			}
			function P() {
				return `.${t.params.slideClass}`;
			}
			function k(e) {
				const { passiveListener: s } = M(), a = P();
				t.$wrapperEl[e]("gesturestart", a, b, s), t.$wrapperEl[e]("gesturechange", a, x, s),
					t.$wrapperEl[e]("gestureend", a, y, s);
			}
			function z() {
				l || (l = !0, k("on"));
			}
			function L() {
				l && (l = !1, k("off"));
			}
			function O() {
				const e = t.zoom;
				if (e.enabled) return;
				e.enabled = !0;
				const s = t.support, { passiveListener: a, activeListenerWithCapture: i } = M(), r = P();
				s.gestures ? (t.$wrapperEl.on(t.touchEvents.start, z, a), t.$wrapperEl.on(t.touchEvents.end, L, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.on(t.touchEvents.start, r, b, a),
					t.$wrapperEl.on(t.touchEvents.move, r, x, i), t.$wrapperEl.on(t.touchEvents.end, r, y, a),
					t.touchEvents.cancel && t.$wrapperEl.on(t.touchEvents.cancel, r, y, a)), t.$wrapperEl.on(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
			}
			function I() {
				const e = t.zoom;
				if (!e.enabled) return;
				const s = t.support;
				e.enabled = !1;
				const { passiveListener: a, activeListenerWithCapture: i } = M(), r = P();
				s.gestures ? (t.$wrapperEl.off(t.touchEvents.start, z, a), t.$wrapperEl.off(t.touchEvents.end, L, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.off(t.touchEvents.start, r, b, a),
					t.$wrapperEl.off(t.touchEvents.move, r, x, i), t.$wrapperEl.off(t.touchEvents.end, r, y, a),
					t.touchEvents.cancel && t.$wrapperEl.off(t.touchEvents.cancel, r, y, a)), t.$wrapperEl.off(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
			}
			Object.defineProperty(t.zoom, "scale", {
				get: () => v,
				set(e) {
					if (v !== e) {
						const t = m.$imageEl ? m.$imageEl[0] : void 0, s = m.$slideEl ? m.$slideEl[0] : void 0;
						i("zoomChange", e, t, s);
					}
					v = e;
				}
			}), a("init", (() => {
				t.params.zoom.enabled && O();
			})), a("destroy", (() => {
				I();
			})), a("touchStart", ((e, s) => {
				t.zoom.enabled && function (e) {
					const s = t.device;
					m.$imageEl && 0 !== m.$imageEl.length && (f.isTouched || (s.android && e.cancelable && e.preventDefault(),
						f.isTouched = !0, f.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
						f.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY));
				}(s);
			})), a("touchEnd", ((e, s) => {
				t.zoom.enabled && function () {
					const e = t.zoom;
					if (!m.$imageEl || 0 === m.$imageEl.length) return;
					if (!f.isTouched || !f.isMoved) return f.isTouched = !1, void (f.isMoved = !1);
					f.isTouched = !1, f.isMoved = !1;
					let s = 300, a = 300;
					const i = g.x * s, r = f.currentX + i, n = g.y * a, l = f.currentY + n;
					0 !== g.x && (s = Math.abs((r - f.currentX) / g.x)), 0 !== g.y && (a = Math.abs((l - f.currentY) / g.y));
					const o = Math.max(s, a);
					f.currentX = r, f.currentY = l;
					const d = f.width * e.scale, c = f.height * e.scale;
					f.minX = Math.min(m.slideWidth / 2 - d / 2, 0), f.maxX = -f.minX, f.minY = Math.min(m.slideHeight / 2 - c / 2, 0),
						f.maxY = -f.minY, f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX), f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY),
						m.$imageWrapEl.transition(o).transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
				}();
			})), a("doubleTap", ((e, s) => {
				!t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && S(s);
			})), a("transitionEnd", (() => {
				t.zoom.enabled && t.params.zoom.enabled && C();
			})), a("slideChange", (() => {
				t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && C();
			})), Object.assign(t.zoom, {
				enable: O,
				disable: I,
				in: T,
				out: $,
				toggle: S
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			s({
				lazy: {
					checkInView: !1,
					enabled: !1,
					loadPrevNext: !1,
					loadPrevNextAmount: 1,
					loadOnTransitionStart: !1,
					scrollingElement: "",
					elementClass: "swiper-lazy",
					loadingClass: "swiper-lazy-loading",
					loadedClass: "swiper-lazy-loaded",
					preloaderClass: "swiper-lazy-preloader"
				}
			}), t.lazy = {};
			let n = !1, l = !1;
			function o(e, s) {
				void 0 === s && (s = !0);
				const a = t.params.lazy;
				if (void 0 === e) return;
				if (0 === t.slides.length) return;
				const r = t.virtual && t.params.virtual.enabled ? t.$wrapperEl.children(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`) : t.slides.eq(e), n = r.find(`.${a.elementClass}:not(.${a.loadedClass}):not(.${a.loadingClass})`);
				!r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || n.push(r[0]),
					0 !== n.length && n.each((e => {
						const n = d(e);
						n.addClass(a.loadingClass);
						const l = n.attr("data-background"), c = n.attr("data-src"), p = n.attr("data-srcset"), u = n.attr("data-sizes"), h = n.parent("picture");
						t.loadImage(n[0], c || l, p, u, !1, (() => {
							if (null != t && t && (!t || t.params) && !t.destroyed) {
								if (l ? (n.css("background-image", `url("${l}")`), n.removeAttr("data-background")) : (p && (n.attr("srcset", p),
									n.removeAttr("data-srcset")), u && (n.attr("sizes", u), n.removeAttr("data-sizes")),
									h.length && h.children("source").each((e => {
										const t = d(e);
										t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")), t.removeAttr("data-srcset"));
									})), c && (n.attr("src", c), n.removeAttr("data-src"))), n.addClass(a.loadedClass).removeClass(a.loadingClass),
									r.find(`.${a.preloaderClass}`).remove(), t.params.loop && s) {
									const e = r.attr("data-swiper-slide-index");
									if (r.hasClass(t.params.slideDuplicateClass)) o(t.$wrapperEl.children(`[data-swiper-slide-index="${e}"]:not(.${t.params.slideDuplicateClass})`).index(), !1); else o(t.$wrapperEl.children(`.${t.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`).index(), !1);
								}
								i("lazyImageReady", r[0], n[0]), t.params.autoHeight && t.updateAutoHeight();
							}
						})), i("lazyImageLoad", r[0], n[0]);
					}));
			}
			function c() {
				const { $wrapperEl: e, params: s, slides: a, activeIndex: i } = t, r = t.virtual && s.virtual.enabled, n = s.lazy;
				let c = s.slidesPerView;
				function p(t) {
					if (r) {
						if (e.children(`.${s.slideClass}[data-swiper-slide-index="${t}"]`).length) return !0;
					} else if (a[t]) return !0;
					return !1;
				}
				function u(e) {
					return r ? d(e).attr("data-swiper-slide-index") : d(e).index();
				}
				if ("auto" === c && (c = 0), l || (l = !0), t.params.watchSlidesProgress) e.children(`.${s.slideVisibleClass}`).each((e => {
					o(r ? d(e).attr("data-swiper-slide-index") : d(e).index());
				})); else if (c > 1) for (let e = i; e < i + c; e += 1) p(e) && o(e); else o(i);
				if (n.loadPrevNext) if (c > 1 || n.loadPrevNextAmount && n.loadPrevNextAmount > 1) {
					const e = n.loadPrevNextAmount, t = Math.ceil(c), s = Math.min(i + t + Math.max(e, t), a.length), r = Math.max(i - Math.max(t, e), 0);
					for (let e = i + t; e < s; e += 1) p(e) && o(e);
					for (let e = r; e < i; e += 1) p(e) && o(e);
				} else {
					const t = e.children(`.${s.slideNextClass}`);
					t.length > 0 && o(u(t));
					const a = e.children(`.${s.slidePrevClass}`);
					a.length > 0 && o(u(a));
				}
			}
			function p() {
				const e = r();
				if (!t || t.destroyed) return;
				const s = t.params.lazy.scrollingElement ? d(t.params.lazy.scrollingElement) : d(e), a = s[0] === e, i = a ? e.innerWidth : s[0].offsetWidth, l = a ? e.innerHeight : s[0].offsetHeight, o = t.$el.offset(), { rtlTranslate: u } = t;
				let h = !1;
				u && (o.left -= t.$el[0].scrollLeft);
				const m = [[o.left, o.top], [o.left + t.width, o.top], [o.left, o.top + t.height], [o.left + t.width, o.top + t.height]];
				for (let e = 0; e < m.length; e += 1) {
					const t = m[e];
					if (t[0] >= 0 && t[0] <= i && t[1] >= 0 && t[1] <= l) {
						if (0 === t[0] && 0 === t[1]) continue;
						h = !0;
					}
				}
				const f = !("touchstart" !== t.touchEvents.start || !t.support.passiveListener || !t.params.passiveListeners) && {
					passive: !0,
					capture: !1
				};
				h ? (c(), s.off("scroll", p, f)) : n || (n = !0, s.on("scroll", p, f));
			}
			a("beforeInit", (() => {
				t.params.lazy.enabled && t.params.preloadImages && (t.params.preloadImages = !1);
			})), a("init", (() => {
				t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
			})), a("scroll", (() => {
				t.params.freeMode && t.params.freeMode.enabled && !t.params.freeMode.sticky && c();
			})), a("scrollbarDragMove resize _freeModeNoMomentumRelease", (() => {
				t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
			})), a("transitionStart", (() => {
				t.params.lazy.enabled && (t.params.lazy.loadOnTransitionStart || !t.params.lazy.loadOnTransitionStart && !l) && (t.params.lazy.checkInView ? p() : c());
			})), a("transitionEnd", (() => {
				t.params.lazy.enabled && !t.params.lazy.loadOnTransitionStart && (t.params.lazy.checkInView ? p() : c());
			})), a("slideChange", (() => {
				const { lazy: e, cssMode: s, watchSlidesProgress: a, touchReleaseOnEdges: i, resistanceRatio: r } = t.params;
				e.enabled && (s || a && (i || 0 === r)) && c();
			})), a("destroy", (() => {
				t.$el && t.$el.find(`.${t.params.lazy.loadingClass}`).removeClass(t.params.lazy.loadingClass);
			})), Object.assign(t.lazy, {
				load: c,
				loadInSlide: o
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			function i(e, t) {
				const s = function () {
					let e, t, s;
					return (a, i) => {
						for (t = -1, e = a.length; e - t > 1;) s = e + t >> 1, a[s] <= i ? t = s : e = s;
						return e;
					};
				}();
				let a, i;
				return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function (e) {
					return e ? (i = s(this.x, e), a = i - 1, (e - this.x[a]) * (this.y[i] - this.y[a]) / (this.x[i] - this.x[a]) + this.y[a]) : 0;
				}, this;
			}
			function r() {
				t.controller.control && t.controller.spline && (t.controller.spline = void 0, delete t.controller.spline);
			}
			s({
				controller: {
					control: void 0,
					inverse: !1,
					by: "slide"
				}
			}), t.controller = {
				control: void 0
			}, a("beforeInit", (() => {
				t.controller.control = t.params.controller.control;
			})), a("update", (() => {
				r();
			})), a("resize", (() => {
				r();
			})), a("observerUpdate", (() => {
				r();
			})), a("setTranslate", ((e, s, a) => {
				t.controller.control && t.controller.setTranslate(s, a);
			})), a("setTransition", ((e, s, a) => {
				t.controller.control && t.controller.setTransition(s, a);
			})), Object.assign(t.controller, {
				setTranslate: function (e, s) {
					const a = t.controller.control;
					let r, n;
					const l = t.constructor;
					function o(e) {
						const s = t.rtlTranslate ? -t.translate : t.translate;
						"slide" === t.params.controller.by && (!function (e) {
							t.controller.spline || (t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid));
						}(e), n = -t.controller.spline.interpolate(-s)), n && "container" !== t.params.controller.by || (r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate()),
							n = (s - t.minTranslate()) * r + e.minTranslate()), t.params.controller.inverse && (n = e.maxTranslate() - n),
							e.updateProgress(n), e.setTranslate(n, t), e.updateActiveIndex(), e.updateSlidesClasses();
					}
					if (Array.isArray(a)) for (let e = 0; e < a.length; e += 1) a[e] !== s && a[e] instanceof l && o(a[e]); else a instanceof l && s !== a && o(a);
				},
				setTransition: function (e, s) {
					const a = t.constructor, i = t.controller.control;
					let r;
					function n(s) {
						s.setTransition(e, t), 0 !== e && (s.transitionStart(), s.params.autoHeight && p((() => {
							s.updateAutoHeight();
						})), s.$wrapperEl.transitionEnd((() => {
							i && (s.params.loop && "slide" === t.params.controller.by && s.loopFix(), s.transitionEnd());
						})));
					}
					if (Array.isArray(i)) for (r = 0; r < i.length; r += 1) i[r] !== s && i[r] instanceof a && n(i[r]); else i instanceof a && s !== i && n(i);
				}
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				a11y: {
					enabled: !0,
					notificationClass: "swiper-notification",
					prevSlideMessage: "Previous slide",
					nextSlideMessage: "Next slide",
					firstSlideMessage: "This is the first slide",
					lastSlideMessage: "This is the last slide",
					paginationBulletMessage: "Go to slide {{index}}",
					slideLabelMessage: "{{index}} / {{slidesLength}}",
					containerMessage: null,
					containerRoleDescriptionMessage: null,
					itemRoleDescriptionMessage: null,
					slideRole: "group",
					id: null
				}
			}), t.a11y = {
				clicked: !1
			};
			let i = null;
			function r(e) {
				const t = i;
				0 !== t.length && (t.html(""), t.html(e));
			}
			function n(e) {
				e.attr("tabIndex", "0");
			}
			function l(e) {
				e.attr("tabIndex", "-1");
			}
			function o(e, t) {
				e.attr("role", t);
			}
			function c(e, t) {
				e.attr("aria-roledescription", t);
			}
			function p(e, t) {
				e.attr("aria-label", t);
			}
			function u(e) {
				e.attr("aria-disabled", !0);
			}
			function h(e) {
				e.attr("aria-disabled", !1);
			}
			function m(e) {
				if (13 !== e.keyCode && 32 !== e.keyCode) return;
				const s = t.params.a11y, a = d(e.target);
				t.navigation && t.navigation.$nextEl && a.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(),
					t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)), t.navigation && t.navigation.$prevEl && a.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(),
						t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)), t.pagination && a.is(U(t.params.pagination.bulletClass)) && a[0].click();
			}
			function f() {
				return t.pagination && t.pagination.bullets && t.pagination.bullets.length;
			}
			function g() {
				return f() && t.params.pagination.clickable;
			}
			const v = (e, t, s) => {
				n(e), "BUTTON" !== e[0].tagName && (o(e, "button"), e.on("keydown", m)), p(e, s),
					function (e, t) {
						e.attr("aria-controls", t);
					}(e, t);
			}, w = () => {
				t.a11y.clicked = !0;
			}, b = () => {
				requestAnimationFrame((() => {
					requestAnimationFrame((() => {
						t.a11y.clicked = !1;
					}));
				}));
			}, x = e => {
				if (t.a11y.clicked) return;
				const s = e.target.closest(`.${t.params.slideClass}`);
				if (!s || !t.slides.includes(s)) return;
				const a = t.slides.indexOf(s) === t.activeIndex, i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
				a || i || (t.isHorizontal() ? t.el.scrollLeft = 0 : t.el.scrollTop = 0, t.slideTo(t.slides.indexOf(s), 0));
			}, y = () => {
				const e = t.params.a11y;
				e.itemRoleDescriptionMessage && c(d(t.slides), e.itemRoleDescriptionMessage), e.slideRole && o(d(t.slides), e.slideRole);
				const s = t.params.loop ? t.slides.filter((e => !e.classList.contains(t.params.slideDuplicateClass))).length : t.slides.length;
				e.slideLabelMessage && t.slides.each(((a, i) => {
					const r = d(a), n = t.params.loop ? parseInt(r.attr("data-swiper-slide-index"), 10) : i;
					p(r, e.slideLabelMessage.replace(/\{\{index\}\}/, n + 1).replace(/\{\{slidesLength\}\}/, s));
				}));
			}, E = () => {
				const e = t.params.a11y;
				t.$el.append(i);
				const s = t.$el;
				e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage), e.containerMessage && p(s, e.containerMessage);
				const a = t.$wrapperEl, r = e.id || a.attr("id") || `swiper-wrapper-${n = 16, void 0 === n && (n = 16),
					"x".repeat(n).replace(/x/g, (() => Math.round(16 * Math.random()).toString(16)))}`;
				var n;
				const l = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
				var o;
				let d, u;
				o = r, a.attr("id", o), function (e, t) {
					e.attr("aria-live", t);
				}(a, l), y(), t.navigation && t.navigation.$nextEl && (d = t.navigation.$nextEl),
					t.navigation && t.navigation.$prevEl && (u = t.navigation.$prevEl), d && d.length && v(d, r, e.nextSlideMessage),
					u && u.length && v(u, r, e.prevSlideMessage), g() && t.pagination.$el.on("keydown", U(t.params.pagination.bulletClass), m),
					t.$el.on("focus", x, !0), t.$el.on("pointerdown", w, !0), t.$el.on("pointerup", b, !0);
			};
			a("beforeInit", (() => {
				i = d(`<span class="${t.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
			})), a("afterInit", (() => {
				t.params.a11y.enabled && E();
			})), a("slidesLengthChange snapGridLengthChange slidesGridLengthChange", (() => {
				t.params.a11y.enabled && y();
			})), a("fromEdge toEdge afterInit lock unlock", (() => {
				t.params.a11y.enabled && function () {
					if (t.params.loop || t.params.rewind || !t.navigation) return;
					const { $nextEl: e, $prevEl: s } = t.navigation;
					s && s.length > 0 && (t.isBeginning ? (u(s), l(s)) : (h(s), n(s))), e && e.length > 0 && (t.isEnd ? (u(e),
						l(e)) : (h(e), n(e)));
				}();
			})), a("paginationUpdate", (() => {
				t.params.a11y.enabled && function () {
					const e = t.params.a11y;
					f() && t.pagination.bullets.each((s => {
						const a = d(s);
						t.params.pagination.clickable && (n(a), t.params.pagination.renderBullet || (o(a, "button"),
							p(a, e.paginationBulletMessage.replace(/\{\{index\}\}/, a.index() + 1)))), a.is(`.${t.params.pagination.bulletActiveClass}`) ? a.attr("aria-current", "true") : a.removeAttr("aria-current");
					}));
				}();
			})), a("destroy", (() => {
				t.params.a11y.enabled && function () {
					let e, s;
					i && i.length > 0 && i.remove(), t.navigation && t.navigation.$nextEl && (e = t.navigation.$nextEl),
						t.navigation && t.navigation.$prevEl && (s = t.navigation.$prevEl), e && e.off("keydown", m),
						s && s.off("keydown", m), g() && t.pagination.$el.off("keydown", U(t.params.pagination.bulletClass), m),
						t.$el.off("focus", x, !0), t.$el.off("pointerdown", w, !0), t.$el.off("pointerup", b, !0);
				}();
			}));
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				history: {
					enabled: !1,
					root: "",
					replaceState: !1,
					key: "slides",
					keepQuery: !1
				}
			});
			let i = !1, n = {};
			const l = e => e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, ""), o = e => {
				const t = r();
				let s;
				s = e ? new URL(e) : t.location;
				const a = s.pathname.slice(1).split("/").filter((e => "" !== e)), i = a.length;
				return {
					key: a[i - 2],
					value: a[i - 1]
				};
			}, d = (e, s) => {
				const a = r();
				if (!i || !t.params.history.enabled) return;
				let n;
				n = t.params.url ? new URL(t.params.url) : a.location;
				const o = t.slides.eq(s);
				let d = l(o.attr("data-history"));
				if (t.params.history.root.length > 0) {
					let s = t.params.history.root;
					"/" === s[s.length - 1] && (s = s.slice(0, s.length - 1)), d = `${s}/${e}/${d}`;
				} else n.pathname.includes(e) || (d = `${e}/${d}`);
				t.params.history.keepQuery && (d += n.search);
				const c = a.history.state;
				c && c.value === d || (t.params.history.replaceState ? a.history.replaceState({
					value: d
				}, null, d) : a.history.pushState({
					value: d
				}, null, d));
			}, c = (e, s, a) => {
				if (s) for (let i = 0, r = t.slides.length; i < r; i += 1) {
					const r = t.slides.eq(i);
					if (l(r.attr("data-history")) === s && !r.hasClass(t.params.slideDuplicateClass)) {
						const s = r.index();
						t.slideTo(s, e, a);
					}
				} else t.slideTo(0, e, a);
			}, p = () => {
				n = o(t.params.url), c(t.params.speed, n.value, !1);
			};
			a("init", (() => {
				t.params.history.enabled && (() => {
					const e = r();
					if (t.params.history) {
						if (!e.history || !e.history.pushState) return t.params.history.enabled = !1, void (t.params.hashNavigation.enabled = !0);
						i = !0, n = o(t.params.url), (n.key || n.value) && (c(0, n.value, t.params.runCallbacksOnInit),
							t.params.history.replaceState || e.addEventListener("popstate", p));
					}
				})();
			})), a("destroy", (() => {
				t.params.history.enabled && (() => {
					const e = r();
					t.params.history.replaceState || e.removeEventListener("popstate", p);
				})();
			})), a("transitionEnd _freeModeNoMomentumRelease", (() => {
				i && d(t.params.history.key, t.activeIndex);
			})), a("slideChange", (() => {
				i && t.params.cssMode && d(t.params.history.key, t.activeIndex);
			}));
		}, function (e) {
			let { swiper: t, extendParams: s, emit: i, on: n } = e, l = !1;
			const o = a(), c = r();
			s({
				hashNavigation: {
					enabled: !1,
					replaceState: !1,
					watchState: !1
				}
			});
			const p = () => {
				i("hashChange");
				const e = o.location.hash.replace("#", "");
				if (e !== t.slides.eq(t.activeIndex).attr("data-hash")) {
					const s = t.$wrapperEl.children(`.${t.params.slideClass}[data-hash="${e}"]`).index();
					if (void 0 === s) return;
					t.slideTo(s);
				}
			}, u = () => {
				if (l && t.params.hashNavigation.enabled) if (t.params.hashNavigation.replaceState && c.history && c.history.replaceState) c.history.replaceState(null, null, `#${t.slides.eq(t.activeIndex).attr("data-hash")}` || ""),
					i("hashSet"); else {
					const e = t.slides.eq(t.activeIndex), s = e.attr("data-hash") || e.attr("data-history");
					o.location.hash = s || "", i("hashSet");
				}
			};
			n("init", (() => {
				t.params.hashNavigation.enabled && (() => {
					if (!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled) return;
					l = !0;
					const e = o.location.hash.replace("#", "");
					if (e) {
						const s = 0;
						for (let a = 0, i = t.slides.length; a < i; a += 1) {
							const i = t.slides.eq(a);
							if ((i.attr("data-hash") || i.attr("data-history")) === e && !i.hasClass(t.params.slideDuplicateClass)) {
								const e = i.index();
								t.slideTo(e, s, t.params.runCallbacksOnInit, !0);
							}
						}
					}
					t.params.hashNavigation.watchState && d(c).on("hashchange", p);
				})();
			})), n("destroy", (() => {
				t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d(c).off("hashchange", p);
			})), n("transitionEnd _freeModeNoMomentumRelease", (() => {
				l && u();
			})), n("slideChange", (() => {
				l && t.params.cssMode && u();
			}));
		}, function (e) {
			let t, { swiper: s, extendParams: i, on: r, emit: n } = e;
			function l() {
				if (!s.size) return s.autoplay.running = !1, void (s.autoplay.paused = !1);
				const e = s.slides.eq(s.activeIndex);
				let a = s.params.autoplay.delay;
				e.attr("data-swiper-autoplay") && (a = e.attr("data-swiper-autoplay") || s.params.autoplay.delay),
					clearTimeout(t), t = p((() => {
						let e;
						s.params.autoplay.reverseDirection ? s.params.loop ? (s.loopFix(), e = s.slidePrev(s.params.speed, !0, !0),
							n("autoplay")) : s.isBeginning ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(s.slides.length - 1, s.params.speed, !0, !0),
								n("autoplay")) : (e = s.slidePrev(s.params.speed, !0, !0), n("autoplay")) : s.params.loop ? (s.loopFix(),
									e = s.slideNext(s.params.speed, !0, !0), n("autoplay")) : s.isEnd ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(0, s.params.speed, !0, !0),
										n("autoplay")) : (e = s.slideNext(s.params.speed, !0, !0), n("autoplay")), (s.params.cssMode && s.autoplay.running || !1 === e) && l();
					}), a);
			}
			function o() {
				return void 0 === t && !s.autoplay.running && (s.autoplay.running = !0, n("autoplayStart"),
					l(), !0);
			}
			function d() {
				return !!s.autoplay.running && void 0 !== t && (t && (clearTimeout(t), t = void 0),
					s.autoplay.running = !1, n("autoplayStop"), !0);
			}
			function c(e) {
				s.autoplay.running && (s.autoplay.paused || (t && clearTimeout(t), s.autoplay.paused = !0,
					0 !== e && s.params.autoplay.waitForTransition ? ["transitionend", "webkitTransitionEnd"].forEach((e => {
						s.$wrapperEl[0].addEventListener(e, h);
					})) : (s.autoplay.paused = !1, l())));
			}
			function u() {
				const e = a();
				"hidden" === e.visibilityState && s.autoplay.running && c(), "visible" === e.visibilityState && s.autoplay.paused && (l(),
					s.autoplay.paused = !1);
			}
			function h(e) {
				s && !s.destroyed && s.$wrapperEl && e.target === s.$wrapperEl[0] && (["transitionend", "webkitTransitionEnd"].forEach((e => {
					s.$wrapperEl[0].removeEventListener(e, h);
				})), s.autoplay.paused = !1, s.autoplay.running ? l() : d());
			}
			function m() {
				s.params.autoplay.disableOnInteraction ? d() : (n("autoplayPause"), c()), ["transitionend", "webkitTransitionEnd"].forEach((e => {
					s.$wrapperEl[0].removeEventListener(e, h);
				}));
			}
			function f() {
				s.params.autoplay.disableOnInteraction || (s.autoplay.paused = !1, n("autoplayResume"),
					l());
			}
			s.autoplay = {
				running: !1,
				paused: !1
			}, i({
				autoplay: {
					enabled: !1,
					delay: 3e3,
					waitForTransition: !0,
					disableOnInteraction: !0,
					stopOnLastSlide: !1,
					reverseDirection: !1,
					pauseOnMouseEnter: !1
				}
			}), r("init", (() => {
				if (s.params.autoplay.enabled) {
					o();
					a().addEventListener("visibilitychange", u), s.params.autoplay.pauseOnMouseEnter && (s.$el.on("mouseenter", m),
						s.$el.on("mouseleave", f));
				}
			})), r("beforeTransitionStart", ((e, t, a) => {
				s.autoplay.running && (a || !s.params.autoplay.disableOnInteraction ? s.autoplay.pause(t) : d());
			})), r("sliderFirstMove", (() => {
				s.autoplay.running && (s.params.autoplay.disableOnInteraction ? d() : c());
			})), r("touchEnd", (() => {
				s.params.cssMode && s.autoplay.paused && !s.params.autoplay.disableOnInteraction && l();
			})), r("destroy", (() => {
				s.$el.off("mouseenter", m), s.$el.off("mouseleave", f), s.autoplay.running && d();
				a().removeEventListener("visibilitychange", u);
			})), Object.assign(s.autoplay, {
				pause: c,
				run: l,
				start: o,
				stop: d
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				thumbs: {
					swiper: null,
					multipleActiveThumbs: !0,
					autoScrollOffset: 0,
					slideThumbActiveClass: "swiper-slide-thumb-active",
					thumbsContainerClass: "swiper-thumbs"
				}
			});
			let i = !1, r = !1;
			function n() {
				const e = t.thumbs.swiper;
				if (!e || e.destroyed) return;
				const s = e.clickedIndex, a = e.clickedSlide;
				if (a && d(a).hasClass(t.params.thumbs.slideThumbActiveClass)) return;
				if (null == s) return;
				let i;
				if (i = e.params.loop ? parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10) : s,
					t.params.loop) {
					let e = t.activeIndex;
					t.slides.eq(e).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), t._clientLeft = t.$wrapperEl[0].clientLeft,
						e = t.activeIndex);
					const s = t.slides.eq(e).prevAll(`[data-swiper-slide-index="${i}"]`).eq(0).index(), a = t.slides.eq(e).nextAll(`[data-swiper-slide-index="${i}"]`).eq(0).index();
					i = void 0 === s ? a : void 0 === a ? s : a - e < e - s ? a : s;
				}
				t.slideTo(i);
			}
			function l() {
				const { thumbs: e } = t.params;
				if (i) return !1;
				i = !0;
				const s = t.constructor;
				if (e.swiper instanceof s) t.thumbs.swiper = e.swiper, Object.assign(t.thumbs.swiper.originalParams, {
					watchSlidesProgress: !0,
					slideToClickedSlide: !1
				}), Object.assign(t.thumbs.swiper.params, {
					watchSlidesProgress: !0,
					slideToClickedSlide: !1
				}); else if (m(e.swiper)) {
					const a = Object.assign({}, e.swiper);
					Object.assign(a, {
						watchSlidesProgress: !0,
						slideToClickedSlide: !1
					}), t.thumbs.swiper = new s(a), r = !0;
				}
				return t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", n),
					!0;
			}
			function o(e) {
				const s = t.thumbs.swiper;
				if (!s || s.destroyed) return;
				const a = "auto" === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView;
				let i = 1;
				const r = t.params.thumbs.slideThumbActiveClass;
				if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView),
					t.params.thumbs.multipleActiveThumbs || (i = 1), i = Math.floor(i), s.slides.removeClass(r),
					s.params.loop || s.params.virtual && s.params.virtual.enabled) for (let e = 0; e < i; e += 1) s.$wrapperEl.children(`[data-swiper-slide-index="${t.realIndex + e}"]`).addClass(r); else for (let e = 0; e < i; e += 1) s.slides.eq(t.realIndex + e).addClass(r);
				const n = t.params.thumbs.autoScrollOffset, l = n && !s.params.loop;
				if (t.realIndex !== s.realIndex || l) {
					let i, r, o = s.activeIndex;
					if (s.params.loop) {
						s.slides.eq(o).hasClass(s.params.slideDuplicateClass) && (s.loopFix(), s._clientLeft = s.$wrapperEl[0].clientLeft,
							o = s.activeIndex);
						const e = s.slides.eq(o).prevAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index(), a = s.slides.eq(o).nextAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index();
						i = void 0 === e ? a : void 0 === a ? e : a - o == o - e ? s.params.slidesPerGroup > 1 ? a : o : a - o < o - e ? a : e,
							r = t.activeIndex > t.previousIndex ? "next" : "prev";
					} else i = t.realIndex, r = i > t.previousIndex ? "next" : "prev";
					l && (i += "next" === r ? n : -1 * n), s.visibleSlidesIndexes && s.visibleSlidesIndexes.indexOf(i) < 0 && (s.params.centeredSlides ? i = i > o ? i - Math.floor(a / 2) + 1 : i + Math.floor(a / 2) - 1 : i > o && s.params.slidesPerGroup,
						s.slideTo(i, e ? 0 : void 0));
				}
			}
			t.thumbs = {
				swiper: null
			}, a("beforeInit", (() => {
				const { thumbs: e } = t.params;
				e && e.swiper && (l(), o(!0));
			})), a("slideChange update resize observerUpdate", (() => {
				o();
			})), a("setTransition", ((e, s) => {
				const a = t.thumbs.swiper;
				a && !a.destroyed && a.setTransition(s);
			})), a("beforeDestroy", (() => {
				const e = t.thumbs.swiper;
				e && !e.destroyed && r && e.destroy();
			})), Object.assign(t.thumbs, {
				init: l,
				update: o
			});
		}, function (e) {
			let { swiper: t, extendParams: s, emit: a, once: i } = e;
			s({
				freeMode: {
					enabled: !1,
					momentum: !0,
					momentumRatio: 1,
					momentumBounce: !0,
					momentumBounceRatio: 1,
					momentumVelocityRatio: 1,
					sticky: !1,
					minimumVelocity: .02
				}
			}), Object.assign(t, {
				freeMode: {
					onTouchStart: function () {
						const e = t.getTranslate();
						t.setTranslate(e), t.setTransition(0), t.touchEventsData.velocities.length = 0,
							t.freeMode.onTouchEnd({
								currentPos: t.rtl ? t.translate : -t.translate
							});
					},
					onTouchMove: function () {
						const { touchEventsData: e, touches: s } = t;
						0 === e.velocities.length && e.velocities.push({
							position: s[t.isHorizontal() ? "startX" : "startY"],
							time: e.touchStartTime
						}), e.velocities.push({
							position: s[t.isHorizontal() ? "currentX" : "currentY"],
							time: u()
						});
					},
					onTouchEnd: function (e) {
						let { currentPos: s } = e;
						const { params: r, $wrapperEl: n, rtlTranslate: l, snapGrid: o, touchEventsData: d } = t, c = u() - d.touchStartTime;
						if (s < -t.minTranslate()) t.slideTo(t.activeIndex); else if (s > -t.maxTranslate()) t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1); else {
							if (r.freeMode.momentum) {
								if (d.velocities.length > 1) {
									const e = d.velocities.pop(), s = d.velocities.pop(), a = e.position - s.position, i = e.time - s.time;
									t.velocity = a / i, t.velocity /= 2, Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0),
										(i > 150 || u() - e.time > 300) && (t.velocity = 0);
								} else t.velocity = 0;
								t.velocity *= r.freeMode.momentumVelocityRatio, d.velocities.length = 0;
								let e = 1e3 * r.freeMode.momentumRatio;
								const s = t.velocity * e;
								let c = t.translate + s;
								l && (c = -c);
								let p, h = !1;
								const m = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
								let f;
								if (c < t.maxTranslate()) r.freeMode.momentumBounce ? (c + t.maxTranslate() < -m && (c = t.maxTranslate() - m),
									p = t.maxTranslate(), h = !0, d.allowMomentumBounce = !0) : c = t.maxTranslate(),
									r.loop && r.centeredSlides && (f = !0); else if (c > t.minTranslate()) r.freeMode.momentumBounce ? (c - t.minTranslate() > m && (c = t.minTranslate() + m),
										p = t.minTranslate(), h = !0, d.allowMomentumBounce = !0) : c = t.minTranslate(),
										r.loop && r.centeredSlides && (f = !0); else if (r.freeMode.sticky) {
											let e;
											for (let t = 0; t < o.length; t += 1) if (o[t] > -c) {
												e = t;
												break;
											}
											c = Math.abs(o[e] - c) < Math.abs(o[e - 1] - c) || "next" === t.swipeDirection ? o[e] : o[e - 1],
												c = -c;
										}
								if (f && i("transitionEnd", (() => {
									t.loopFix();
								})), 0 !== t.velocity) {
									if (e = l ? Math.abs((-c - t.translate) / t.velocity) : Math.abs((c - t.translate) / t.velocity),
										r.freeMode.sticky) {
										const s = Math.abs((l ? -c : c) - t.translate), a = t.slidesSizesGrid[t.activeIndex];
										e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed;
									}
								} else if (r.freeMode.sticky) return void t.slideToClosest();
								r.freeMode.momentumBounce && h ? (t.updateProgress(p), t.setTransition(e), t.setTranslate(c),
									t.transitionStart(!0, t.swipeDirection), t.animating = !0, n.transitionEnd((() => {
										t && !t.destroyed && d.allowMomentumBounce && (a("momentumBounce"), t.setTransition(r.speed),
											setTimeout((() => {
												t.setTranslate(p), n.transitionEnd((() => {
													t && !t.destroyed && t.transitionEnd();
												}));
											}), 0));
									}))) : t.velocity ? (a("_freeModeNoMomentumRelease"), t.updateProgress(c), t.setTransition(e),
										t.setTranslate(c), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0,
											n.transitionEnd((() => {
												t && !t.destroyed && t.transitionEnd();
											})))) : t.updateProgress(c), t.updateActiveIndex(), t.updateSlidesClasses();
							} else {
								if (r.freeMode.sticky) return void t.slideToClosest();
								r.freeMode && a("_freeModeNoMomentumRelease");
							}
							(!r.freeMode.momentum || c >= r.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(),
								t.updateSlidesClasses());
						}
					}
				}
			});
		}, function (e) {
			let t, s, a, { swiper: i, extendParams: r } = e;
			r({
				grid: {
					rows: 1,
					fill: "column"
				}
			}), i.grid = {
				initSlides: e => {
					const { slidesPerView: r } = i.params, { rows: n, fill: l } = i.params.grid;
					s = t / n, a = Math.floor(e / n), t = Math.floor(e / n) === e / n ? e : Math.ceil(e / n) * n,
						"auto" !== r && "row" === l && (t = Math.max(t, r * n));
				},
				updateSlide: (e, r, n, l) => {
					const { slidesPerGroup: o, spaceBetween: d } = i.params, { rows: c, fill: p } = i.params.grid;
					let u, h, m;
					if ("row" === p && o > 1) {
						const s = Math.floor(e / (o * c)), a = e - c * o * s, i = 0 === s ? o : Math.min(Math.ceil((n - s * c * o) / c), o);
						m = Math.floor(a / i), h = a - m * i + s * o, u = h + m * t / c, r.css({
							"-webkit-order": u,
							order: u
						});
					} else "column" === p ? (h = Math.floor(e / c), m = e - h * c, (h > a || h === a && m === c - 1) && (m += 1,
						m >= c && (m = 0, h += 1))) : (m = Math.floor(e / s), h = e - m * s);
					r.css(l("margin-top"), 0 !== m ? d && `${d}px` : "");
				},
				updateWrapperSize: (e, s, a) => {
					const { spaceBetween: r, centeredSlides: n, roundLengths: l } = i.params, { rows: o } = i.params.grid;
					if (i.virtualSize = (e + r) * t, i.virtualSize = Math.ceil(i.virtualSize / o) - r,
						i.$wrapperEl.css({
							[a("width")]: `${i.virtualSize + r}px`
						}), n) {
						s.splice(0, s.length);
						const e = [];
						for (let t = 0; t < s.length; t += 1) {
							let a = s[t];
							l && (a = Math.floor(a)), s[t] < i.virtualSize + s[0] && e.push(a);
						}
						s.push(...e);
					}
				}
			};
		}, function (e) {
			let { swiper: t } = e;
			Object.assign(t, {
				appendSlide: K.bind(t),
				prependSlide: Z.bind(t),
				addSlide: Q.bind(t),
				removeSlide: J.bind(t),
				removeAllSlides: ee.bind(t)
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				fadeEffect: {
					crossFade: !1,
					transformEl: null
				}
			}), te({
				effect: "fade",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e } = t, s = t.params.fadeEffect;
					for (let a = 0; a < e.length; a += 1) {
						const e = t.slides.eq(a);
						let i = -e[0].swiperSlideOffset;
						t.params.virtualTranslate || (i -= t.translate);
						let r = 0;
						t.isHorizontal() || (r = i, i = 0);
						const n = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e[0].progress), 0) : 1 + Math.min(Math.max(e[0].progress, -1), 0);
						se(s, e).css({
							opacity: n
						}).transform(`translate3d(${i}px, ${r}px, 0px)`);
					}
				},
				setTransition: e => {
					const { transformEl: s } = t.params.fadeEffect;
					(s ? t.slides.find(s) : t.slides).transition(e), ae({
						swiper: t,
						duration: e,
						transformEl: s,
						allSlides: !0
					});
				},
				overwriteParams: () => ({
					slidesPerView: 1,
					slidesPerGroup: 1,
					watchSlidesProgress: !0,
					spaceBetween: 0,
					virtualTranslate: !t.params.cssMode
				})
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				cubeEffect: {
					slideShadows: !0,
					shadow: !0,
					shadowOffset: 20,
					shadowScale: .94
				}
			});
			const i = (e, t, s) => {
				let a = s ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"), i = s ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
				0 === a.length && (a = d(`<div class="swiper-slide-shadow-${s ? "left" : "top"}"></div>`),
					e.append(a)), 0 === i.length && (i = d(`<div class="swiper-slide-shadow-${s ? "right" : "bottom"}"></div>`),
						e.append(i)), a.length && (a[0].style.opacity = Math.max(-t, 0)), i.length && (i[0].style.opacity = Math.max(t, 0));
			};
			te({
				effect: "cube",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { $el: e, $wrapperEl: s, slides: a, width: r, height: n, rtlTranslate: l, size: o, browser: c } = t, p = t.params.cubeEffect, u = t.isHorizontal(), h = t.virtual && t.params.virtual.enabled;
					let m, f = 0;
					p.shadow && (u ? (m = s.find(".swiper-cube-shadow"), 0 === m.length && (m = d('<div class="swiper-cube-shadow"></div>'),
						s.append(m)), m.css({
							height: `${r}px`
						})) : (m = e.find(".swiper-cube-shadow"), 0 === m.length && (m = d('<div class="swiper-cube-shadow"></div>'),
							e.append(m))));
					for (let e = 0; e < a.length; e += 1) {
						const t = a.eq(e);
						let s = e;
						h && (s = parseInt(t.attr("data-swiper-slide-index"), 10));
						let r = 90 * s, n = Math.floor(r / 360);
						l && (r = -r, n = Math.floor(-r / 360));
						const d = Math.max(Math.min(t[0].progress, 1), -1);
						let c = 0, m = 0, g = 0;
						s % 4 == 0 ? (c = 4 * -n * o, g = 0) : (s - 1) % 4 == 0 ? (c = 0, g = 4 * -n * o) : (s - 2) % 4 == 0 ? (c = o + 4 * n * o,
							g = o) : (s - 3) % 4 == 0 && (c = -o, g = 3 * o + 4 * o * n), l && (c = -c), u || (m = c,
								c = 0);
						const v = `rotateX(${u ? 0 : -r}deg) rotateY(${u ? r : 0}deg) translate3d(${c}px, ${m}px, ${g}px)`;
						d <= 1 && d > -1 && (f = 90 * s + 90 * d, l && (f = 90 * -s - 90 * d)), t.transform(v),
							p.slideShadows && i(t, d, u);
					}
					if (s.css({
						"-webkit-transform-origin": `50% 50% -${o / 2}px`,
						"transform-origin": `50% 50% -${o / 2}px`
					}), p.shadow) if (u) m.transform(`translate3d(0px, ${r / 2 + p.shadowOffset}px, ${-r / 2}px) rotateX(90deg) rotateZ(0deg) scale(${p.shadowScale})`); else {
						const e = Math.abs(f) - 90 * Math.floor(Math.abs(f) / 90), t = 1.5 - (Math.sin(2 * e * Math.PI / 360) / 2 + Math.cos(2 * e * Math.PI / 360) / 2), s = p.shadowScale, a = p.shadowScale / t, i = p.shadowOffset;
						m.transform(`scale3d(${s}, 1, ${a}) translate3d(0px, ${n / 2 + i}px, ${-n / 2 / a}px) rotateX(-90deg)`);
					}
					const g = c.isSafari || c.isWebView ? -o / 2 : 0;
					s.transform(`translate3d(0px,0,${g}px) rotateX(${t.isHorizontal() ? 0 : f}deg) rotateY(${t.isHorizontal() ? -f : 0}deg)`),
						s[0].style.setProperty("--swiper-cube-translate-z", `${g}px`);
				},
				setTransition: e => {
					const { $el: s, slides: a } = t;
					a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
						t.params.cubeEffect.shadow && !t.isHorizontal() && s.find(".swiper-cube-shadow").transition(e);
				},
				recreateShadows: () => {
					const e = t.isHorizontal();
					t.slides.each((t => {
						const s = Math.max(Math.min(t.progress, 1), -1);
						i(d(t), s, e);
					}));
				},
				getEffectParams: () => t.params.cubeEffect,
				perspective: () => !0,
				overwriteParams: () => ({
					slidesPerView: 1,
					slidesPerGroup: 1,
					watchSlidesProgress: !0,
					resistanceRatio: 0,
					spaceBetween: 0,
					centeredSlides: !1,
					virtualTranslate: !0
				})
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				flipEffect: {
					slideShadows: !0,
					limitRotation: !0,
					transformEl: null
				}
			});
			const i = (e, s, a) => {
				let i = t.isHorizontal() ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"), r = t.isHorizontal() ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
				0 === i.length && (i = ie(a, e, t.isHorizontal() ? "left" : "top")), 0 === r.length && (r = ie(a, e, t.isHorizontal() ? "right" : "bottom")),
					i.length && (i[0].style.opacity = Math.max(-s, 0)), r.length && (r[0].style.opacity = Math.max(s, 0));
			};
			te({
				effect: "flip",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e, rtlTranslate: s } = t, a = t.params.flipEffect;
					for (let r = 0; r < e.length; r += 1) {
						const n = e.eq(r);
						let l = n[0].progress;
						t.params.flipEffect.limitRotation && (l = Math.max(Math.min(n[0].progress, 1), -1));
						const o = n[0].swiperSlideOffset;
						let d = -180 * l, c = 0, p = t.params.cssMode ? -o - t.translate : -o, u = 0;
						t.isHorizontal() ? s && (d = -d) : (u = p, p = 0, c = -d, d = 0), n[0].style.zIndex = -Math.abs(Math.round(l)) + e.length,
							a.slideShadows && i(n, l, a);
						const h = `translate3d(${p}px, ${u}px, 0px) rotateX(${c}deg) rotateY(${d}deg)`;
						se(a, n).transform(h);
					}
				},
				setTransition: e => {
					const { transformEl: s } = t.params.flipEffect;
					(s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
						ae({
							swiper: t,
							duration: e,
							transformEl: s
						});
				},
				recreateShadows: () => {
					const e = t.params.flipEffect;
					t.slides.each((s => {
						const a = d(s);
						let r = a[0].progress;
						t.params.flipEffect.limitRotation && (r = Math.max(Math.min(s.progress, 1), -1)),
							i(a, r, e);
					}));
				},
				getEffectParams: () => t.params.flipEffect,
				perspective: () => !0,
				overwriteParams: () => ({
					slidesPerView: 1,
					slidesPerGroup: 1,
					watchSlidesProgress: !0,
					spaceBetween: 0,
					virtualTranslate: !t.params.cssMode
				})
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					scale: 1,
					modifier: 1,
					slideShadows: !0,
					transformEl: null
				}
			}), te({
				effect: "coverflow",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { width: e, height: s, slides: a, slidesSizesGrid: i } = t, r = t.params.coverflowEffect, n = t.isHorizontal(), l = t.translate, o = n ? e / 2 - l : s / 2 - l, d = n ? r.rotate : -r.rotate, c = r.depth;
					for (let e = 0, t = a.length; e < t; e += 1) {
						const t = a.eq(e), s = i[e], l = (o - t[0].swiperSlideOffset - s / 2) / s, p = "function" == typeof r.modifier ? r.modifier(l) : l * r.modifier;
						let u = n ? d * p : 0, h = n ? 0 : d * p, m = -c * Math.abs(p), f = r.stretch;
						"string" == typeof f && -1 !== f.indexOf("%") && (f = parseFloat(r.stretch) / 100 * s);
						let g = n ? 0 : f * p, v = n ? f * p : 0, w = 1 - (1 - r.scale) * Math.abs(p);
						Math.abs(v) < .001 && (v = 0), Math.abs(g) < .001 && (g = 0), Math.abs(m) < .001 && (m = 0),
							Math.abs(u) < .001 && (u = 0), Math.abs(h) < .001 && (h = 0), Math.abs(w) < .001 && (w = 0);
						const b = `translate3d(${v}px,${g}px,${m}px)  rotateX(${h}deg) rotateY(${u}deg) scale(${w})`;
						if (se(r, t).transform(b), t[0].style.zIndex = 1 - Math.abs(Math.round(p)), r.slideShadows) {
							let e = n ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"), s = n ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
							0 === e.length && (e = ie(r, t, n ? "left" : "top")), 0 === s.length && (s = ie(r, t, n ? "right" : "bottom")),
								e.length && (e[0].style.opacity = p > 0 ? p : 0), s.length && (s[0].style.opacity = -p > 0 ? -p : 0);
						}
					}
				},
				setTransition: e => {
					const { transformEl: s } = t.params.coverflowEffect;
					(s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e);
				},
				perspective: () => !0,
				overwriteParams: () => ({
					watchSlidesProgress: !0
				})
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				creativeEffect: {
					transformEl: null,
					limitProgress: 1,
					shadowPerProgress: !1,
					progressMultiplier: 1,
					perspective: !0,
					prev: {
						translate: [0, 0, 0],
						rotate: [0, 0, 0],
						opacity: 1,
						scale: 1
					},
					next: {
						translate: [0, 0, 0],
						rotate: [0, 0, 0],
						opacity: 1,
						scale: 1
					}
				}
			});
			const i = e => "string" == typeof e ? e : `${e}px`;
			te({
				effect: "creative",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e, $wrapperEl: s, slidesSizesGrid: a } = t, r = t.params.creativeEffect, { progressMultiplier: n } = r, l = t.params.centeredSlides;
					if (l) {
						const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
						s.transform(`translateX(calc(50% - ${e}px))`);
					}
					for (let s = 0; s < e.length; s += 1) {
						const a = e.eq(s), o = a[0].progress, d = Math.min(Math.max(a[0].progress, -r.limitProgress), r.limitProgress);
						let c = d;
						l || (c = Math.min(Math.max(a[0].originalProgress, -r.limitProgress), r.limitProgress));
						const p = a[0].swiperSlideOffset, u = [t.params.cssMode ? -p - t.translate : -p, 0, 0], h = [0, 0, 0];
						let m = !1;
						t.isHorizontal() || (u[1] = u[0], u[0] = 0);
						let f = {
							translate: [0, 0, 0],
							rotate: [0, 0, 0],
							scale: 1,
							opacity: 1
						};
						d < 0 ? (f = r.next, m = !0) : d > 0 && (f = r.prev, m = !0), u.forEach(((e, t) => {
							u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d * n)}))`;
						})), h.forEach(((e, t) => {
							h[t] = f.rotate[t] * Math.abs(d * n);
						})), a[0].style.zIndex = -Math.abs(Math.round(o)) + e.length;
						const g = u.join(", "), v = `rotateX(${h[0]}deg) rotateY(${h[1]}deg) rotateZ(${h[2]}deg)`, w = c < 0 ? `scale(${1 + (1 - f.scale) * c * n})` : `scale(${1 - (1 - f.scale) * c * n})`, b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n, x = `translate3d(${g}) ${v} ${w}`;
						if (m && f.shadow || !m) {
							let e = a.children(".swiper-slide-shadow");
							if (0 === e.length && f.shadow && (e = ie(r, a)), e.length) {
								const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
								e[0].style.opacity = Math.min(Math.max(Math.abs(t), 0), 1);
							}
						}
						const y = se(r, a);
						y.transform(x).css({
							opacity: b
						}), f.origin && y.css("transform-origin", f.origin);
					}
				},
				setTransition: e => {
					const { transformEl: s } = t.params.creativeEffect;
					(s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e),
						ae({
							swiper: t,
							duration: e,
							transformEl: s,
							allSlides: !0
						});
				},
				perspective: () => t.params.creativeEffect.perspective,
				overwriteParams: () => ({
					watchSlidesProgress: !0,
					virtualTranslate: !t.params.cssMode
				})
			});
		}, function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({
				cardsEffect: {
					slideShadows: !0,
					transformEl: null,
					rotate: !0,
					perSlideRotate: 2,
					perSlideOffset: 8
				}
			}), te({
				effect: "cards",
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e, activeIndex: s } = t, a = t.params.cardsEffect, { startTranslate: i, isTouched: r } = t.touchEventsData, n = t.translate;
					for (let l = 0; l < e.length; l += 1) {
						const o = e.eq(l), d = o[0].progress, c = Math.min(Math.max(d, -4), 4);
						let p = o[0].swiperSlideOffset;
						t.params.centeredSlides && !t.params.cssMode && t.$wrapperEl.transform(`translateX(${t.minTranslate()}px)`),
							t.params.centeredSlides && t.params.cssMode && (p -= e[0].swiperSlideOffset);
						let u = t.params.cssMode ? -p - t.translate : -p, h = 0;
						const m = -100 * Math.abs(c);
						let f = 1, g = -a.perSlideRotate * c, v = a.perSlideOffset - .75 * Math.abs(c);
						const w = t.virtual && t.params.virtual.enabled ? t.virtual.from + l : l, b = (w === s || w === s - 1) && c > 0 && c < 1 && (r || t.params.cssMode) && n < i, x = (w === s || w === s + 1) && c < 0 && c > -1 && (r || t.params.cssMode) && n > i;
						if (b || x) {
							const e = (1 - Math.abs((Math.abs(c) - .5) / .5)) ** .5;
							g += -28 * c * e, f += -.5 * e, v += 96 * e, h = -25 * e * Math.abs(c) + "%";
						}
						if (u = c < 0 ? `calc(${u}px + (${v * Math.abs(c)}%))` : c > 0 ? `calc(${u}px + (-${v * Math.abs(c)}%))` : `${u}px`,
							!t.isHorizontal()) {
							const e = h;
							h = u, u = e;
						}
						const y = c < 0 ? "" + (1 + (1 - f) * c) : "" + (1 - (1 - f) * c), E = `\n        translate3d(${u}, ${h}, ${m}px)\n        rotateZ(${a.rotate ? g : 0}deg)\n        scale(${y})\n      `;
						if (a.slideShadows) {
							let e = o.find(".swiper-slide-shadow");
							0 === e.length && (e = ie(a, o)), e.length && (e[0].style.opacity = Math.min(Math.max((Math.abs(c) - .5) / .5, 0), 1));
						}
						o[0].style.zIndex = -Math.abs(Math.round(d)) + e.length;
						se(a, o).transform(E);
					}
				},
				setTransition: e => {
					const { transformEl: s } = t.params.cardsEffect;
					(s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e),
						ae({
							swiper: t,
							duration: e,
							transformEl: s
						});
				},
				perspective: () => !0,
				overwriteParams: () => ({
					watchSlidesProgress: !0,
					virtualTranslate: !t.params.cssMode
				})
			});
		}];
		return V.use(re), V;
	}));
	!function (t, e) {
		"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).noUiSlider = {});
	}(void 0, (function (ot) {
		"use strict";
		function n(t) {
			return "object" == typeof t && "function" == typeof t.to;
		}
		function st(t) {
			t.parentElement.removeChild(t);
		}
		function at(t) {
			return null != t;
		}
		function lt(t) {
			t.preventDefault();
		}
		function i(t) {
			return "number" == typeof t && !isNaN(t) && isFinite(t);
		}
		function ut(t, e, r) {
			0 < r && (ft(t, e), setTimeout((function () {
				dt(t, e);
			}), r));
		}
		function ct(t) {
			return Math.max(Math.min(t, 100), 0);
		}
		function pt(t) {
			return Array.isArray(t) ? t : [t];
		}
		function e(t) {
			t = (t = String(t)).split(".");
			return 1 < t.length ? t[1].length : 0;
		}
		function ft(t, e) {
			t.classList && !/\s/.test(e) ? t.classList.add(e) : t.className += " " + e;
		}
		function dt(t, e) {
			t.classList && !/\s/.test(e) ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " ");
		}
		function ht(t) {
			var e = void 0 !== window.pageXOffset, r = "CSS1Compat" === (t.compatMode || "");
			return {
				x: e ? window.pageXOffset : (r ? t.documentElement : t.body).scrollLeft,
				y: e ? window.pageYOffset : (r ? t.documentElement : t.body).scrollTop
			};
		}
		function s(t, e) {
			return 100 / (e - t);
		}
		function a(t, e, r) {
			return 100 * e / (t[r + 1] - t[r]);
		}
		function l(t, e) {
			for (var r = 1; t >= e[r];) r += 1;
			return r;
		}
		function r(t, e, r) {
			if (r >= t.slice(-1)[0]) return 100;
			var n = l(r, t), i = t[n - 1], o = t[n];
			t = e[n - 1], n = e[n];
			return t + (r, a(o = [i, o], o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0) / s(t, n));
		}
		function o(t, e, r, n) {
			if (100 === n) return n;
			var i = l(n, t), o = t[i - 1], s = t[i];
			return r ? (s - o) / 2 < n - o ? s : o : e[i - 1] ? t[i - 1] + (t = n - t[i - 1],
				i = e[i - 1], Math.round(t / i) * i) : n;
		}
		ot.PipsMode = void 0, (H = ot.PipsMode || (ot.PipsMode = {})).Range = "range", H.Steps = "steps",
			H.Positions = "positions", H.Count = "count", H.Values = "values", ot.PipsType = void 0,
			(H = ot.PipsType || (ot.PipsType = {}))[H.None = -1] = "None", H[H.NoValue = 0] = "NoValue",
			H[H.LargeValue = 1] = "LargeValue", H[H.SmallValue = 2] = "SmallValue";
		var u = (t.prototype.getDistance = function (t) {
			for (var e = [], r = 0; r < this.xNumSteps.length - 1; r++) e[r] = a(this.xVal, t, r);
			return e;
		}, t.prototype.getAbsoluteDistance = function (t, e, r) {
			var n = 0;
			if (t < this.xPct[this.xPct.length - 1]) for (; t > this.xPct[n + 1];) n++; else t === this.xPct[this.xPct.length - 1] && (n = this.xPct.length - 2);
			r || t !== this.xPct[n + 1] || n++;
			for (var i, o = 1, s = (e = null === e ? [] : e)[n], a = 0, l = 0, u = 0, c = r ? (t - this.xPct[n]) / (this.xPct[n + 1] - this.xPct[n]) : (this.xPct[n + 1] - t) / (this.xPct[n + 1] - this.xPct[n]); 0 < s;) i = this.xPct[n + 1 + u] - this.xPct[n + u],
				100 < e[n + u] * o + 100 - 100 * c ? (a = i * c, o = (s - 100 * c) / e[n + u], c = 1) : (a = e[n + u] * i / 100 * o,
					o = 0), r ? (l -= a, 1 <= this.xPct.length + u && u--) : (l += a, 1 <= this.xPct.length - u && u++),
				s = e[n + u] * o;
			return t + l;
		}, t.prototype.toStepping = function (t) {
			return t = r(this.xVal, this.xPct, t);
		}, t.prototype.fromStepping = function (t) {
			return function (t, e, r) {
				if (100 <= r) return t.slice(-1)[0];
				var n = l(r, e), i = t[n - 1], o = t[n];
				t = e[n - 1], n = e[n];
				return (r - t) * s(t, n) * ((o = [i, o])[1] - o[0]) / 100 + o[0];
			}(this.xVal, this.xPct, t);
		}, t.prototype.getStep = function (t) {
			return t = o(this.xPct, this.xSteps, this.snap, t);
		}, t.prototype.getDefaultStep = function (t, e, r) {
			var n = l(t, this.xPct);
			return (100 === t || e && t === this.xPct[n - 1]) && (n = Math.max(n - 1, 1)), (this.xVal[n] - this.xVal[n - 1]) / r;
		}, t.prototype.getNearbySteps = function (t) {
			t = l(t, this.xPct);
			return {
				stepBefore: {
					startValue: this.xVal[t - 2],
					step: this.xNumSteps[t - 2],
					highestStep: this.xHighestCompleteStep[t - 2]
				},
				thisStep: {
					startValue: this.xVal[t - 1],
					step: this.xNumSteps[t - 1],
					highestStep: this.xHighestCompleteStep[t - 1]
				},
				stepAfter: {
					startValue: this.xVal[t],
					step: this.xNumSteps[t],
					highestStep: this.xHighestCompleteStep[t]
				}
			};
		}, t.prototype.countStepDecimals = function () {
			var t = this.xNumSteps.map(e);
			return Math.max.apply(null, t);
		}, t.prototype.hasNoSize = function () {
			return this.xVal[0] === this.xVal[this.xVal.length - 1];
		}, t.prototype.convert = function (t) {
			return this.getStep(this.toStepping(t));
		}, t.prototype.handleEntryPoint = function (t, e) {
			t = "min" === t ? 0 : "max" === t ? 100 : parseFloat(t);
			if (!i(t) || !i(e[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
			this.xPct.push(t), this.xVal.push(e[0]);
			e = Number(e[1]);
			t ? this.xSteps.push(!isNaN(e) && e) : isNaN(e) || (this.xSteps[0] = e), this.xHighestCompleteStep.push(0);
		}, t.prototype.handleStepPoint = function (t, e) {
			e && (this.xVal[t] !== this.xVal[t + 1] ? (this.xSteps[t] = a([this.xVal[t], this.xVal[t + 1]], e, 0) / s(this.xPct[t], this.xPct[t + 1]),
				e = (this.xVal[t + 1] - this.xVal[t]) / this.xNumSteps[t], e = Math.ceil(Number(e.toFixed(3)) - 1),
				e = this.xVal[t] + this.xNumSteps[t] * e, this.xHighestCompleteStep[t] = e) : this.xSteps[t] = this.xHighestCompleteStep[t] = this.xVal[t]);
		}, t);
		function t(e, t, r) {
			var n;
			this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [],
				this.xSteps = [r || !1], this.xNumSteps = [!1], this.snap = t;
			var i = [];
			for (Object.keys(e).forEach((function (t) {
				i.push([pt(e[t]), t]);
			})), i.sort((function (t, e) {
				return t[0][0] - e[0][0];
			})), n = 0; n < i.length; n++) this.handleEntryPoint(i[n][1], i[n][0]);
			for (this.xNumSteps = this.xSteps.slice(0), n = 0; n < this.xNumSteps.length; n++) this.handleStepPoint(n, this.xNumSteps[n]);
		}
		var c = {
			to: function (t) {
				return void 0 === t ? "" : t.toFixed(2);
			},
			from: Number
		}, p = {
			target: "target",
			base: "base",
			origin: "origin",
			handle: "handle",
			handleLower: "handle-lower",
			handleUpper: "handle-upper",
			touchArea: "touch-area",
			horizontal: "horizontal",
			vertical: "vertical",
			background: "background",
			connect: "connect",
			connects: "connects",
			ltr: "ltr",
			rtl: "rtl",
			textDirectionLtr: "txt-dir-ltr",
			textDirectionRtl: "txt-dir-rtl",
			draggable: "draggable",
			drag: "state-drag",
			tap: "state-tap",
			active: "active",
			tooltip: "tooltip",
			pips: "pips",
			pipsHorizontal: "pips-horizontal",
			pipsVertical: "pips-vertical",
			marker: "marker",
			markerHorizontal: "marker-horizontal",
			markerVertical: "marker-vertical",
			markerNormal: "marker-normal",
			markerLarge: "marker-large",
			markerSub: "marker-sub",
			value: "value",
			valueHorizontal: "value-horizontal",
			valueVertical: "value-vertical",
			valueNormal: "value-normal",
			valueLarge: "value-large",
			valueSub: "value-sub"
		}, mt = {
			tooltips: ".__tooltips",
			aria: ".__aria"
		};
		function f(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'step' is not numeric.");
			t.singleStep = e;
		}
		function d(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
			t.keyboardPageMultiplier = e;
		}
		function h(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
			t.keyboardMultiplier = e;
		}
		function m(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
			t.keyboardDefaultStep = e;
		}
		function g(t, e) {
			if ("object" != typeof e || Array.isArray(e)) throw new Error("noUiSlider: 'range' is not an object.");
			if (void 0 === e.min || void 0 === e.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
			t.spectrum = new u(e, t.snap || !1, t.singleStep);
		}
		function v(t, e) {
			if (e = pt(e), !Array.isArray(e) || !e.length) throw new Error("noUiSlider: 'start' option is incorrect.");
			t.handles = e.length, t.start = e;
		}
		function b(t, e) {
			if ("boolean" != typeof e) throw new Error("noUiSlider: 'snap' option must be a boolean.");
			t.snap = e;
		}
		function S(t, e) {
			if ("boolean" != typeof e) throw new Error("noUiSlider: 'animate' option must be a boolean.");
			t.animate = e;
		}
		function x(t, e) {
			if ("number" != typeof e) throw new Error("noUiSlider: 'animationDuration' option must be a number.");
			t.animationDuration = e;
		}
		function y(t, e) {
			var r, n = [!1];
			if ("lower" === e ? e = [!0, !1] : "upper" === e && (e = [!1, !0]), !0 === e || !1 === e) {
				for (r = 1; r < t.handles; r++) n.push(e);
				n.push(!1);
			} else {
				if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
				n = e;
			}
			t.connect = n;
		}
		function w(t, e) {
			switch (e) {
				case "horizontal":
					t.ort = 0;
					break;

				case "vertical":
					t.ort = 1;
					break;

				default:
					throw new Error("noUiSlider: 'orientation' option is invalid.");
			}
		}
		function E(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'margin' option must be numeric.");
			0 !== e && (t.margin = t.spectrum.getDistance(e));
		}
		function P(t, e) {
			if (!i(e)) throw new Error("noUiSlider: 'limit' option must be numeric.");
			if (t.limit = t.spectrum.getDistance(e), !t.limit || t.handles < 2) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
		}
		function C(t, e) {
			var r;
			if (!i(e) && !Array.isArray(e)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
			if (Array.isArray(e) && 2 !== e.length && !i(e[0]) && !i(e[1])) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
			if (0 !== e) {
				for (Array.isArray(e) || (e = [e, e]), t.padding = [t.spectrum.getDistance(e[0]), t.spectrum.getDistance(e[1])],
					r = 0; r < t.spectrum.xNumSteps.length - 1; r++) if (t.padding[0][r] < 0 || t.padding[1][r] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
				var n = e[0] + e[1];
				e = t.spectrum.xVal[0];
				if (1 < n / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - e)) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
			}
		}
		function N(t, e) {
			switch (e) {
				case "ltr":
					t.dir = 0;
					break;

				case "rtl":
					t.dir = 1;
					break;

				default:
					throw new Error("noUiSlider: 'direction' option was not recognized.");
			}
		}
		function V(t, e) {
			if ("string" != typeof e) throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
			var r = 0 <= e.indexOf("tap"), n = 0 <= e.indexOf("drag"), i = 0 <= e.indexOf("fixed"), o = 0 <= e.indexOf("snap"), s = 0 <= e.indexOf("hover"), a = 0 <= e.indexOf("unconstrained"), l = 0 <= e.indexOf("drag-all");
			e = 0 <= e.indexOf("smooth-steps");
			if (i) {
				if (2 !== t.handles) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
				E(t, t.start[1] - t.start[0]);
			}
			if (a && (t.margin || t.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
			t.events = {
				tap: r || o,
				drag: n,
				dragAll: l,
				smoothSteps: e,
				fixed: i,
				snap: o,
				hover: s,
				unconstrained: a
			};
		}
		function k(t, e) {
			if (!1 !== e) if (!0 === e || n(e)) {
				t.tooltips = [];
				for (var r = 0; r < t.handles; r++) t.tooltips.push(e);
			} else {
				if ((e = pt(e)).length !== t.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
				e.forEach((function (t) {
					if ("boolean" != typeof t && !n(t)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				})), t.tooltips = e;
			}
		}
		function M(t, e) {
			if (e.length !== t.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
			t.handleAttributes = e;
		}
		function A(t, e) {
			if (!n(e)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
			t.ariaFormat = e;
		}
		function U(t, e) {
			if (!n(r = e) || "function" != typeof r.from) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
			var r;
			t.format = e;
		}
		function D(t, e) {
			if ("boolean" != typeof e) throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
			t.keyboardSupport = e;
		}
		function O(t, e) {
			t.documentElement = e;
		}
		function L(t, e) {
			if ("string" != typeof e && !1 !== e) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
			t.cssPrefix = e;
		}
		function T(e, r) {
			if ("object" != typeof r) throw new Error("noUiSlider: 'cssClasses' must be an object.");
			"string" == typeof e.cssPrefix ? (e.cssClasses = {}, Object.keys(r).forEach((function (t) {
				e.cssClasses[t] = e.cssPrefix + r[t];
			}))) : e.cssClasses = r;
		}
		function gt(e) {
			var r = {
				margin: null,
				limit: null,
				padding: null,
				animate: !0,
				animationDuration: 300,
				ariaFormat: c,
				format: c
			}, n = {
				step: {
					r: !1,
					t: f
				},
				keyboardPageMultiplier: {
					r: !1,
					t: d
				},
				keyboardMultiplier: {
					r: !1,
					t: h
				},
				keyboardDefaultStep: {
					r: !1,
					t: m
				},
				start: {
					r: !0,
					t: v
				},
				connect: {
					r: !0,
					t: y
				},
				direction: {
					r: !0,
					t: N
				},
				snap: {
					r: !1,
					t: b
				},
				animate: {
					r: !1,
					t: S
				},
				animationDuration: {
					r: !1,
					t: x
				},
				range: {
					r: !0,
					t: g
				},
				orientation: {
					r: !1,
					t: w
				},
				margin: {
					r: !1,
					t: E
				},
				limit: {
					r: !1,
					t: P
				},
				padding: {
					r: !1,
					t: C
				},
				behaviour: {
					r: !0,
					t: V
				},
				ariaFormat: {
					r: !1,
					t: A
				},
				format: {
					r: !1,
					t: U
				},
				tooltips: {
					r: !1,
					t: k
				},
				keyboardSupport: {
					r: !0,
					t: D
				},
				documentElement: {
					r: !1,
					t: O
				},
				cssPrefix: {
					r: !0,
					t: L
				},
				cssClasses: {
					r: !0,
					t: T
				},
				handleAttributes: {
					r: !1,
					t: M
				}
			}, i = {
				connect: !1,
				direction: "ltr",
				behaviour: "tap",
				orientation: "horizontal",
				keyboardSupport: !0,
				cssPrefix: "noUi-",
				cssClasses: p,
				keyboardPageMultiplier: 5,
				keyboardMultiplier: 1,
				keyboardDefaultStep: 10
			};
			e.format && !e.ariaFormat && (e.ariaFormat = e.format), Object.keys(n).forEach((function (t) {
				if (at(e[t]) || void 0 !== i[t]) n[t].t(r, (at(e[t]) ? e : i)[t]); else if (n[t].r) throw new Error("noUiSlider: '" + t + "' is required.");
			})), r.pips = e.pips;
			var t = document.createElement("div"), o = void 0 !== t.style.msTransform;
			t = void 0 !== t.style.transform;
			r.transformRule = t ? "transform" : o ? "msTransform" : "webkitTransform";
			return r.style = [["left", "top"], ["right", "bottom"]][r.dir][r.ort], r;
		}
		function j(t, f, o) {
			var i, l, a, n, s, u, c = window.navigator.pointerEnabled ? {
				start: "pointerdown",
				move: "pointermove",
				end: "pointerup"
			} : window.navigator.msPointerEnabled ? {
				start: "MSPointerDown",
				move: "MSPointerMove",
				end: "MSPointerUp"
			} : {
				start: "mousedown touchstart",
				move: "mousemove touchmove",
				end: "mouseup touchend"
			}, p = window.CSS && CSS.supports && CSS.supports("touch-action", "none") && function () {
				var t = !1;
				try {
					var e = Object.defineProperty({}, "passive", {
						get: function () {
							t = !0;
						}
					});
					window.addEventListener("test", null, e);
				} catch (t) { }
				return t;
			}(), d = t, S = f.spectrum, h = [], m = [], g = [], v = 0, b = {}, x = t.ownerDocument, y = f.documentElement || x.documentElement, w = x.body, E = "rtl" === x.dir || 1 === f.ort ? 0 : 100;
			function P(t, e) {
				var r = x.createElement("div");
				return e && ft(r, e), t.appendChild(r), r;
			}
			function C(t, e) {
				t = P(t, f.cssClasses.origin);
				var r, n = P(t, f.cssClasses.handle);
				return P(n, f.cssClasses.touchArea), n.setAttribute("data-handle", String(e)), f.keyboardSupport && (n.setAttribute("tabindex", "0"),
					n.addEventListener("keydown", (function (t) {
						return function (t, e) {
							if (V() || k(e)) return !1;
							var r = ["Left", "Right"], n = ["Down", "Up"], i = ["PageDown", "PageUp"], o = ["Home", "End"];
							f.dir && !f.ort ? r.reverse() : f.ort && !f.dir && (n.reverse(), i.reverse());
							var s = t.key.replace("Arrow", ""), a = s === i[0], l = s === i[1];
							i = s === n[0] || s === r[0] || a, n = s === n[1] || s === r[1] || l, r = s === o[0],
								o = s === o[1];
							if (!(i || n || r || o)) return !0;
							if (t.preventDefault(), n || i) {
								var u = i ? 0 : 1;
								u = nt(e)[u];
								if (null === u) return !1;
								!1 === u && (u = S.getDefaultStep(m[e], i, f.keyboardDefaultStep)), u *= l || a ? f.keyboardPageMultiplier : f.keyboardMultiplier,
									u = Math.max(u, 1e-7), u *= i ? -1 : 1, u = h[e] + u;
							} else u = o ? f.spectrum.xVal[f.spectrum.xVal.length - 1] : f.spectrum.xVal[0];
							return Q(e, S.toStepping(u), !0, !0), I("slide", e), I("update", e), I("change", e),
								I("set", e), !1;
						}(t, e);
					}))), void 0 !== f.handleAttributes && (r = f.handleAttributes[e], Object.keys(r).forEach((function (t) {
						n.setAttribute(t, r[t]);
					}))), n.setAttribute("role", "slider"), n.setAttribute("aria-orientation", f.ort ? "vertical" : "horizontal"),
					0 === e ? ft(n, f.cssClasses.handleLower) : e === f.handles - 1 && ft(n, f.cssClasses.handleUpper),
					t;
			}
			function N(t, e) {
				return !!e && P(t, f.cssClasses.connect);
			}
			function e(t, e) {
				return !(!f.tooltips || !f.tooltips[e]) && P(t.firstChild, f.cssClasses.tooltip);
			}
			function V() {
				return d.hasAttribute("disabled");
			}
			function k(t) {
				return l[t].hasAttribute("disabled");
			}
			function M() {
				s && (Y("update" + mt.tooltips), s.forEach((function (t) {
					t && st(t);
				})), s = null);
			}
			function A() {
				M(), s = l.map(e), X("update" + mt.tooltips, (function (t, e, r) {
					s && f.tooltips && !1 !== s[e] && (t = t[e], !0 !== f.tooltips[e] && (t = f.tooltips[e].to(r[e])),
						s[e].innerHTML = t);
				}));
			}
			function U(t, e) {
				return t.map((function (t) {
					return S.fromStepping(e ? S.getStep(t) : t);
				}));
			}
			function D(d) {
				var h = function (t) {
					if (t.mode === ot.PipsMode.Range || t.mode === ot.PipsMode.Steps) return S.xVal;
					if (t.mode !== ot.PipsMode.Count) return t.mode === ot.PipsMode.Positions ? U(t.values, t.stepped) : t.mode === ot.PipsMode.Values ? t.stepped ? t.values.map((function (t) {
						return S.fromStepping(S.getStep(S.toStepping(t)));
					})) : t.values : [];
					if (t.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
					for (var e = t.values - 1, r = 100 / e, n = []; e--;) n[e] = e * r;
					return n.push(100), U(n, t.stepped);
				}(d), m = {}, t = S.xVal[0], e = S.xVal[S.xVal.length - 1], g = !1, v = !1, b = 0;
				return (h = h.slice().sort((function (t, e) {
					return t - e;
				})).filter((function (t) {
					return !this[t] && (this[t] = !0);
				}), {}))[0] !== t && (h.unshift(t), g = !0), h[h.length - 1] !== e && (h.push(e),
					v = !0), h.forEach((function (t, e) {
						t;
						var r, n, i, o, s, a, l, u, c = h[e + 1], p = d.mode === ot.PipsMode.Steps, f = (f = p ? S.xNumSteps[e] : f) || c - t;
						for (void 0 === c && (c = t), f = Math.max(f, 1e-7), r = t; r <= c; r = Number((r + f).toFixed(7))) {
							for (a = (o = (i = S.toStepping(r)) - b) / (d.density || 1), u = o / (l = Math.round(a)),
								n = 1; n <= l; n += 1) m[(s = b + n * u).toFixed(5)] = [S.fromStepping(s), 0];
							a = -1 < h.indexOf(r) ? ot.PipsType.LargeValue : p ? ot.PipsType.SmallValue : ot.PipsType.NoValue,
								!e && g && r !== c && (a = 0), r === c && v || (m[i.toFixed(5)] = [r, a]), b = i;
						}
					})), m;
			}
			function O(i, o, s) {
				var t, a = x.createElement("div"), n = ((t = {})[ot.PipsType.None] = "", t[ot.PipsType.NoValue] = f.cssClasses.valueNormal,
					t[ot.PipsType.LargeValue] = f.cssClasses.valueLarge, t[ot.PipsType.SmallValue] = f.cssClasses.valueSub,
					t), l = ((t = {})[ot.PipsType.None] = "", t[ot.PipsType.NoValue] = f.cssClasses.markerNormal,
						t[ot.PipsType.LargeValue] = f.cssClasses.markerLarge, t[ot.PipsType.SmallValue] = f.cssClasses.markerSub,
						t), u = [f.cssClasses.valueHorizontal, f.cssClasses.valueVertical], c = [f.cssClasses.markerHorizontal, f.cssClasses.markerVertical];
				function p(t, e) {
					var r = e === f.cssClasses.value;
					return e + " " + (r ? u : c)[f.ort] + " " + (r ? n : l)[t];
				}
				return ft(a, f.cssClasses.pips), ft(a, 0 === f.ort ? f.cssClasses.pipsHorizontal : f.cssClasses.pipsVertical),
					Object.keys(i).forEach((function (t) {
						var e, r, n;
						r = i[e = t][0], n = i[t][1], (n = o ? o(r, n) : n) !== ot.PipsType.None && ((t = P(a, !1)).className = p(n, f.cssClasses.marker),
							t.style[f.style] = e + "%", n > ot.PipsType.NoValue && ((t = P(a, !1)).className = p(n, f.cssClasses.value),
								t.setAttribute("data-value", String(r)), t.style[f.style] = e + "%", t.innerHTML = String(s.to(r))));
					})), a;
			}
			function L() {
				n && (st(n), n = null);
			}
			function T(t) {
				L();
				var e = D(t), r = t.filter;
				t = t.format || {
					to: function (t) {
						return String(Math.round(t));
					}
				};
				return n = d.appendChild(O(e, r, t));
			}
			function j() {
				var t = i.getBoundingClientRect(), e = "offset" + ["Width", "Height"][f.ort];
				return 0 === f.ort ? t.width || i[e] : t.height || i[e];
			}
			function z(n, i, o, s) {
				function e(t) {
					var e, r = function (e, t, r) {
						var n = 0 === e.type.indexOf("touch"), i = 0 === e.type.indexOf("mouse"), o = 0 === e.type.indexOf("pointer"), s = 0, a = 0;
						0 === e.type.indexOf("MSPointer") && (o = !0);
						if ("mousedown" === e.type && !e.buttons && !e.touches) return !1;
						if (n) {
							var l = function (t) {
								t = t.target;
								return t === r || r.contains(t) || e.composed && e.composedPath().shift() === r;
							};
							if ("touchstart" === e.type) {
								n = Array.prototype.filter.call(e.touches, l);
								if (1 < n.length) return !1;
								s = n[0].pageX, a = n[0].pageY;
							} else {
								l = Array.prototype.find.call(e.changedTouches, l);
								if (!l) return !1;
								s = l.pageX, a = l.pageY;
							}
						}
						t = t || ht(x), (i || o) && (s = e.clientX + t.x, a = e.clientY + t.y);
						return e.pageOffset = t, e.points = [s, a], e.cursor = i || o, e;
					}(t, s.pageOffset, s.target || i);
					return !!r && !(V() && !s.doNotReject) && (e = d, t = f.cssClasses.tap, !((e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)) && !s.doNotReject) && !(n === c.start && void 0 !== r.buttons && 1 < r.buttons) && (!s.hover || !r.buttons) && (p || r.preventDefault(),
						r.calcPoint = r.points[f.ort], void o(r, s)));
				}
				var r = [];
				return n.split(" ").forEach((function (t) {
					i.addEventListener(t, e, !!p && {
						passive: !0
					}), r.push([t, e]);
				})), r;
			}
			function H(t) {
				var e, r, n = ct(n = 100 * (t - (n = i, e = f.ort, r = n.getBoundingClientRect(),
					n = (t = n.ownerDocument).documentElement, t = ht(t), /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (t.x = 0),
					e ? r.top + t.y - n.clientTop : r.left + t.x - n.clientLeft)) / j());
				return f.dir ? 100 - n : n;
			}
			function F(t, e) {
				"mouseout" === t.type && "HTML" === t.target.nodeName && null === t.relatedTarget && _(t, e);
			}
			function R(t, e) {
				if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === t.buttons && 0 !== e.buttonsProperty) return _(t, e);
				t = (f.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
				G(0 < t, 100 * t / e.baseSize, e.locations, e.handleNumbers, e.connect);
			}
			function _(t, e) {
				e.handle && (dt(e.handle, f.cssClasses.active), --v), e.listeners.forEach((function (t) {
					y.removeEventListener(t[0], t[1]);
				})), 0 === v && (dt(d, f.cssClasses.drag), K(), t.cursor && (w.style.cursor = "",
					w.removeEventListener("selectstart", lt))), f.events.smoothSteps && (e.handleNumbers.forEach((function (t) {
						Q(t, m[t], !0, !0, !1, !1);
					})), e.handleNumbers.forEach((function (t) {
						I("update", t);
					}))), e.handleNumbers.forEach((function (t) {
						I("change", t), I("set", t), I("end", t);
					}));
			}
			function B(t, e) {
				var r, n, i, o;
				e.handleNumbers.some(k) || (1 === e.handleNumbers.length && (o = l[e.handleNumbers[0]].children[0],
					v += 1, ft(o, f.cssClasses.active)), t.stopPropagation(), n = z(c.move, y, R, {
						target: t.target,
						handle: o,
						connect: e.connect,
						listeners: r = [],
						startCalcPoint: t.calcPoint,
						baseSize: j(),
						pageOffset: t.pageOffset,
						handleNumbers: e.handleNumbers,
						buttonsProperty: t.buttons,
						locations: m.slice()
					}), i = z(c.end, y, _, {
						target: t.target,
						handle: o,
						listeners: r,
						doNotReject: !0,
						handleNumbers: e.handleNumbers
					}), o = z("mouseout", y, F, {
						target: t.target,
						handle: o,
						listeners: r,
						doNotReject: !0,
						handleNumbers: e.handleNumbers
					}), r.push.apply(r, n.concat(i, o)), t.cursor && (w.style.cursor = getComputedStyle(t.target).cursor,
						1 < l.length && ft(d, f.cssClasses.drag), w.addEventListener("selectstart", lt, !1)),
					e.handleNumbers.forEach((function (t) {
						I("start", t);
					})));
			}
			function r(t) {
				t.stopPropagation();
				var i, o, s, e = H(t.calcPoint), r = (i = e, s = !(o = 100), l.forEach((function (t, e) {
					var r, n;
					k(e) || (r = m[e], ((n = Math.abs(r - i)) < o || n <= o && r < i || 100 === n && 100 === o) && (s = e,
						o = n));
				})), s);
				!1 !== r && (f.events.snap || ut(d, f.cssClasses.tap, f.animationDuration), Q(r, e, !0, !0),
					K(), I("slide", r, !0), I("update", r, !0), f.events.snap ? B(t, {
						handleNumbers: [r]
					}) : (I("change", r, !0), I("set", r, !0)));
			}
			function q(t) {
				t = H(t.calcPoint), t = S.getStep(t);
				var e = S.fromStepping(t);
				Object.keys(b).forEach((function (t) {
					"hover" === t.split(".")[0] && b[t].forEach((function (t) {
						t.call(it, e);
					}));
				}));
			}
			function X(t, e) {
				b[t] = b[t] || [], b[t].push(e), "update" === t.split(".")[0] && l.forEach((function (t, e) {
					I("update", e);
				}));
			}
			function Y(t) {
				var n = t && t.split(".")[0], i = n ? t.substring(n.length) : t;
				Object.keys(b).forEach((function (t) {
					var e = t.split(".")[0], r = t.substring(e.length);
					n && n !== e || i && i !== r || ((e = r) !== mt.aria && e !== mt.tooltips || i === r) && delete b[t];
				}));
			}
			function I(r, n, i) {
				Object.keys(b).forEach((function (t) {
					var e = t.split(".")[0];
					r === e && b[t].forEach((function (t) {
						t.call(it, h.map(f.format.to), n, h.slice(), i || !1, m.slice(), it);
					}));
				}));
			}
			function W(t, e, r, n, i, o, s) {
				var a;
				return 1 < l.length && !f.events.unconstrained && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.margin, !1),
					r = Math.max(r, a)), i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.margin, !0),
						r = Math.min(r, a))), 1 < l.length && f.limit && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.limit, !1),
							r = Math.min(r, a)), i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.limit, !0),
								r = Math.max(r, a))), f.padding && (0 === e && (a = S.getAbsoluteDistance(0, f.padding[0], !1),
									r = Math.max(r, a)), e === l.length - 1 && (a = S.getAbsoluteDistance(100, f.padding[1], !0),
										r = Math.min(r, a))), !((r = ct(r = !s ? S.getStep(r) : r)) === t[e] && !o) && r;
			}
			function $(t, e) {
				var r = f.ort;
				return (r ? e : t) + ", " + (r ? t : e);
			}
			function G(t, r, n, e, i) {
				var o = n.slice(), s = e[0], a = f.events.smoothSteps, l = [!t, t], u = [t, !t];
				e = e.slice(), t && e.reverse(), 1 < e.length ? e.forEach((function (t, e) {
					e = W(o, t, o[t] + r, l[e], u[e], !1, a);
					!1 === e ? r = 0 : (r = e - o[t], o[t] = e);
				})) : l = u = [!0];
				var c = !1;
				e.forEach((function (t, e) {
					c = Q(t, n[t] + r, l[e], u[e], !1, a) || c;
				})), c && (e.forEach((function (t) {
					I("update", t), I("slide", t);
				})), null != i && I("drag", s));
			}
			function J(t, e) {
				return f.dir ? 100 - t - e : t;
			}
			function K() {
				g.forEach((function (t) {
					var e = 50 < m[t] ? -1 : 1;
					e = 3 + (l.length + e * t);
					l[t].style.zIndex = String(e);
				}));
			}
			function Q(t, e, r, n, i, o) {
				return !1 !== (e = i ? e : W(m, t, e, r, n, !1, o)) && (e, m[t] = e, h[t] = S.fromStepping(e),
					e = "translate(" + $(J(e, 0) - E + "%", "0") + ")", l[t].style[f.transformRule] = e,
					Z(t), Z(t + 1), !0);
			}
			function Z(t) {
				var e, r;
				a[t] && (r = 100, e = "translate(" + $(J(e = (e = 0) !== t ? m[t - 1] : e, r = (r = t !== a.length - 1 ? m[t] : r) - e) + "%", "0") + ")",
					r = "scale(" + $(r / 100, "1") + ")", a[t].style[f.transformRule] = e + " " + r);
			}
			function tt(t, e) {
				return null === t || !1 === t || void 0 === t ? m[e] : ("number" == typeof t && (t = String(t)),
					!1 === (t = !1 !== (t = f.format.from(t)) ? S.toStepping(t) : t) || isNaN(t) ? m[e] : t);
			}
			function et(t, e, r) {
				var n = pt(t);
				t = void 0 === m[0];
				e = void 0 === e || e, f.animate && !t && ut(d, f.cssClasses.tap, f.animationDuration),
					g.forEach((function (t) {
						Q(t, tt(n[t], t), !0, !1, r);
					}));
				var i, o = 1 === g.length ? 0 : 1;
				for (t && S.hasNoSize() && (r = !0, m[0] = 0, 1 < g.length && (i = 100 / (g.length - 1),
					g.forEach((function (t) {
						m[t] = t * i;
					})))); o < g.length; ++o) g.forEach((function (t) {
						Q(t, m[t], !0, !0, r);
					}));
				K(), g.forEach((function (t) {
					I("update", t), null !== n[t] && e && I("set", t);
				}));
			}
			function rt(t) {
				if (t = void 0 === t ? !1 : t) return 1 === h.length ? h[0] : h.slice(0);
				t = h.map(f.format.to);
				return 1 === t.length ? t[0] : t;
			}
			function nt(t) {
				var e = m[t], r = S.getNearbySteps(e), n = h[t], i = r.thisStep.step;
				t = null;
				if (f.snap) return [n - r.stepBefore.startValue || null, r.stepAfter.startValue - n || null];
				!1 !== i && n + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - n),
					t = n > r.thisStep.startValue ? r.thisStep.step : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep,
					100 === e ? i = null : 0 === e && (t = null);
				e = S.countStepDecimals();
				return null !== i && !1 !== i && (i = Number(i.toFixed(e))), [t = null !== t && !1 !== t ? Number(t.toFixed(e)) : t, i];
			}
			ft(t = d, f.cssClasses.target), 0 === f.dir ? ft(t, f.cssClasses.ltr) : ft(t, f.cssClasses.rtl),
				0 === f.ort ? ft(t, f.cssClasses.horizontal) : ft(t, f.cssClasses.vertical), ft(t, "rtl" === getComputedStyle(t).direction ? f.cssClasses.textDirectionRtl : f.cssClasses.textDirectionLtr),
				i = P(t, f.cssClasses.base), function (t, e) {
					var r = P(e, f.cssClasses.connects);
					l = [], (a = []).push(N(r, t[0]));
					for (var n = 0; n < f.handles; n++) l.push(C(e, n)), g[n] = n, a.push(N(r, t[n + 1]));
				}(f.connect, i), (u = f.events).fixed || l.forEach((function (t, e) {
					z(c.start, t.children[0], B, {
						handleNumbers: [e]
					});
				})), u.tap && z(c.start, i, r, {}), u.hover && z(c.move, i, q, {
					hover: !0
				}), u.drag && a.forEach((function (e, t) {
					var r, n, i, o, s;
					!1 !== e && 0 !== t && t !== a.length - 1 && (r = l[t - 1], n = l[t], i = [e],
						o = [r, n], s = [t - 1, t], ft(e, f.cssClasses.draggable), u.fixed && (i.push(r.children[0]),
							i.push(n.children[0])), u.dragAll && (o = l, s = g), i.forEach((function (t) {
								z(c.start, t, B, {
									handles: o,
									handleNumbers: s,
									connect: e
								});
							})));
				})), et(f.start), f.pips && T(f.pips), f.tooltips && A(), Y("update" + mt.aria),
				X("update" + mt.aria, (function (t, e, o, r, s) {
					g.forEach((function (t) {
						var e = l[t], r = W(m, t, 0, !0, !0, !0), n = W(m, t, 100, !0, !0, !0), i = s[t];
						t = String(f.ariaFormat.to(o[t])), r = S.fromStepping(r).toFixed(1), n = S.fromStepping(n).toFixed(1),
							i = S.fromStepping(i).toFixed(1);
						e.children[0].setAttribute("aria-valuemin", r), e.children[0].setAttribute("aria-valuemax", n),
							e.children[0].setAttribute("aria-valuenow", i), e.children[0].setAttribute("aria-valuetext", t);
					}));
				}));
			var it = {
				destroy: function () {
					for (Y(mt.aria), Y(mt.tooltips), Object.keys(f.cssClasses).forEach((function (t) {
						dt(d, f.cssClasses[t]);
					})); d.firstChild;) d.removeChild(d.firstChild);
					delete d.noUiSlider;
				},
				steps: function () {
					return g.map(nt);
				},
				on: X,
				off: Y,
				get: rt,
				set: et,
				setHandle: function (t, e, r, n) {
					if (!(0 <= (t = Number(t)) && t < g.length)) throw new Error("noUiSlider: invalid handle number, got: " + t);
					Q(t, tt(e, t), !0, !0, n), I("update", t), r && I("set", t);
				},
				reset: function (t) {
					et(f.start, t);
				},
				__moveHandles: function (t, e, r) {
					G(t, e, m, r);
				},
				options: o,
				updateOptions: function (e, t) {
					var r = rt(), n = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
					n.forEach((function (t) {
						void 0 !== e[t] && (o[t] = e[t]);
					}));
					var i = gt(o);
					n.forEach((function (t) {
						void 0 !== e[t] && (f[t] = i[t]);
					})), S = i.spectrum, f.margin = i.margin, f.limit = i.limit, f.padding = i.padding,
						f.pips ? T(f.pips) : L(), (f.tooltips ? A : M)(), m = [], et(at(e.start) ? e.start : r, t);
				},
				target: d,
				removePips: L,
				removeTooltips: M,
				getPositions: function () {
					return m.slice();
				},
				getTooltips: function () {
					return s;
				},
				getOrigins: function () {
					return l;
				},
				pips: T
			};
			return it;
		}
		function z(t, e) {
			if (!t || !t.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + t);
			if (t.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
			e = j(t, gt(e), e);
			return t.noUiSlider = e;
		}
		var H = {
			__spectrum: u,
			cssClasses: p,
			create: z
		};
		ot.create = z, ot.cssClasses = p, ot.default = H, Object.defineProperty(ot, "__esModule", {
			value: !0
		});
	}));
	!function (t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).SimpleBar = e();
	}(void 0, (function () {
		"use strict";
		var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
		function e(t, e) {
			return t(e = {
				exports: {}
			}, e.exports), e.exports;
		}
		var r, n, i = function (t) {
			return t && t.Math == Math && t;
		}, o = i("object" == typeof globalThis && globalThis) || i("object" == typeof window && window) || i("object" == typeof self && self) || i("object" == typeof t && t) || function () {
			return this;
		}() || Function("return this")(), s = Object.defineProperty, a = function (t, e) {
			try {
				s(o, t, {
					value: e,
					configurable: !0,
					writable: !0
				});
			} catch (r) {
				o[t] = e;
			}
			return e;
		}, c = o["__core-js_shared__"] || a("__core-js_shared__", {}), l = e((function (t) {
			(t.exports = function (t, e) {
				return c[t] || (c[t] = void 0 !== e ? e : {});
			})("versions", []).push({
				version: "3.22.6",
				mode: "global",
				copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)",
				license: "https://github.com/zloirock/core-js/blob/v3.22.6/LICENSE",
				source: "https://github.com/zloirock/core-js"
			});
		})), u = function (t) {
			try {
				return !!t();
			} catch (t) {
				return !0;
			}
		}, f = !u((function () {
			var t = function () { }.bind();
			return "function" != typeof t || t.hasOwnProperty("prototype");
		})), h = Function.prototype, d = h.bind, p = h.call, v = f && d.bind(p, p), g = f ? function (t) {
			return t && v(t);
		} : function (t) {
			return t && function () {
				return p.apply(t, arguments);
			};
		}, b = o.TypeError, y = function (t) {
			if (null == t) throw b("Can't call method on " + t);
			return t;
		}, m = o.Object, x = function (t) {
			return m(y(t));
		}, E = g({}.hasOwnProperty), w = Object.hasOwn || function (t, e) {
			return E(x(t), e);
		}, O = 0, S = Math.random(), A = g(1..toString), k = function (t) {
			return "Symbol(" + (void 0 === t ? "" : t) + ")_" + A(++O + S, 36);
		}, T = function (t) {
			return "function" == typeof t;
		}, L = function (t) {
			return T(t) ? t : void 0;
		}, R = function (t, e) {
			return arguments.length < 2 ? L(o[t]) : o[t] && o[t][e];
		}, _ = R("navigator", "userAgent") || "", j = o.process, z = o.Deno, M = j && j.versions || z && z.version, C = M && M.v8;
		C && (n = (r = C.split("."))[0] > 0 && r[0] < 4 ? 1 : +(r[0] + r[1])), !n && _ && (!(r = _.match(/Edge\/(\d+)/)) || r[1] >= 74) && (r = _.match(/Chrome\/(\d+)/)) && (n = +r[1]);
		var N = n, W = !!Object.getOwnPropertySymbols && !u((function () {
			var t = Symbol();
			return !String(t) || !(Object(t) instanceof Symbol) || !Symbol.sham && N && N < 41;
		})), I = W && !Symbol.sham && "symbol" == typeof Symbol.iterator, P = l("wks"), B = o.Symbol, D = B && B.for, F = I ? B : B && B.withoutSetter || k, V = function (t) {
			if (!w(P, t) || !W && "string" != typeof P[t]) {
				var e = "Symbol." + t;
				W && w(B, t) ? P[t] = B[t] : P[t] = I && D ? D(e) : F(e);
			}
			return P[t];
		}, $ = {};
		$[V("toStringTag")] = "z";
		var X = "[object z]" === String($), H = !u((function () {
			return 7 != Object.defineProperty({}, 1, {
				get: function () {
					return 7;
				}
			})[1];
		})), q = function (t) {
			return "object" == typeof t ? null !== t : T(t);
		}, Y = o.document, G = q(Y) && q(Y.createElement), U = function (t) {
			return G ? Y.createElement(t) : {};
		}, K = !H && !u((function () {
			return 7 != Object.defineProperty(U("div"), "a", {
				get: function () {
					return 7;
				}
			}).a;
		})), J = H && u((function () {
			return 42 != Object.defineProperty((function () { }), "prototype", {
				value: 42,
				writable: !1
			}).prototype;
		})), Q = o.String, Z = o.TypeError, tt = function (t) {
			if (q(t)) return t;
			throw Z(Q(t) + " is not an object");
		}, et = Function.prototype.call, rt = f ? et.bind(et) : function () {
			return et.apply(et, arguments);
		}, nt = g({}.isPrototypeOf), it = o.Object, ot = I ? function (t) {
			return "symbol" == typeof t;
		} : function (t) {
			var e = R("Symbol");
			return T(e) && nt(e.prototype, it(t));
		}, st = o.String, at = function (t) {
			try {
				return st(t);
			} catch (t) {
				return "Object";
			}
		}, ct = o.TypeError, lt = function (t) {
			if (T(t)) return t;
			throw ct(at(t) + " is not a function");
		}, ut = function (t, e) {
			var r = t[e];
			return null == r ? void 0 : lt(r);
		}, ft = o.TypeError, ht = o.TypeError, dt = V("toPrimitive"), pt = function (t, e) {
			if (!q(t) || ot(t)) return t;
			var r, n = ut(t, dt);
			if (n) {
				if (void 0 === e && (e = "default"), r = rt(n, t, e), !q(r) || ot(r)) return r;
				throw ht("Can't convert object to primitive value");
			}
			return void 0 === e && (e = "number"), function (t, e) {
				var r, n;
				if ("string" === e && T(r = t.toString) && !q(n = rt(r, t))) return n;
				if (T(r = t.valueOf) && !q(n = rt(r, t))) return n;
				if ("string" !== e && T(r = t.toString) && !q(n = rt(r, t))) return n;
				throw ft("Can't convert object to primitive value");
			}(t, e);
		}, vt = function (t) {
			var e = pt(t, "string");
			return ot(e) ? e : e + "";
		}, gt = o.TypeError, bt = Object.defineProperty, yt = Object.getOwnPropertyDescriptor, mt = {
			f: H ? J ? function (t, e, r) {
				if (tt(t), e = vt(e), tt(r), "function" == typeof t && "prototype" === e && "value" in r && "writable" in r && !r.writable) {
					var n = yt(t, e);
					n && n.writable && (t[e] = r.value, r = {
						configurable: "configurable" in r ? r.configurable : n.configurable,
						enumerable: "enumerable" in r ? r.enumerable : n.enumerable,
						writable: !1
					});
				}
				return bt(t, e, r);
			} : bt : function (t, e, r) {
				if (tt(t), e = vt(e), tt(r), K) try {
					return bt(t, e, r);
				} catch (t) { }
				if ("get" in r || "set" in r) throw gt("Accessors not supported");
				return "value" in r && (t[e] = r.value), t;
			}
		}, xt = function (t, e) {
			return {
				enumerable: !(1 & t),
				configurable: !(2 & t),
				writable: !(4 & t),
				value: e
			};
		}, Et = H ? function (t, e, r) {
			return mt.f(t, e, xt(1, r));
		} : function (t, e, r) {
			return t[e] = r, t;
		}, wt = Function.prototype, Ot = H && Object.getOwnPropertyDescriptor, St = w(wt, "name"), At = {
			EXISTS: St,
			PROPER: St && "something" === function () { }.name,
			CONFIGURABLE: St && (!H || H && Ot(wt, "name").configurable)
		}, kt = g(Function.toString);
		T(c.inspectSource) || (c.inspectSource = function (t) {
			return kt(t);
		});
		var Tt, Lt, Rt, _t = c.inspectSource, jt = o.WeakMap, zt = T(jt) && /native code/.test(_t(jt)), Mt = l("keys"), Ct = function (t) {
			return Mt[t] || (Mt[t] = k(t));
		}, Nt = {}, Wt = o.TypeError, It = o.WeakMap;
		if (zt || c.state) {
			var Pt = c.state || (c.state = new It), Bt = g(Pt.get), Dt = g(Pt.has), Ft = g(Pt.set);
			Tt = function (t, e) {
				if (Dt(Pt, t)) throw new Wt("Object already initialized");
				return e.facade = t, Ft(Pt, t, e), e;
			}, Lt = function (t) {
				return Bt(Pt, t) || {};
			}, Rt = function (t) {
				return Dt(Pt, t);
			};
		} else {
			var Vt = Ct("state");
			Nt[Vt] = !0, Tt = function (t, e) {
				if (w(t, Vt)) throw new Wt("Object already initialized");
				return e.facade = t, Et(t, Vt, e), e;
			}, Lt = function (t) {
				return w(t, Vt) ? t[Vt] : {};
			}, Rt = function (t) {
				return w(t, Vt);
			};
		}
		var $t = {
			set: Tt,
			get: Lt,
			has: Rt,
			enforce: function (t) {
				return Rt(t) ? Lt(t) : Tt(t, {});
			},
			getterFor: function (t) {
				return function (e) {
					var r;
					if (!q(e) || (r = Lt(e)).type !== t) throw Wt("Incompatible receiver, " + t + " required");
					return r;
				};
			}
		}, Xt = e((function (t) {
			var e = At.CONFIGURABLE, r = $t.enforce, n = $t.get, i = Object.defineProperty, o = H && !u((function () {
				return 8 !== i((function () { }), "length", {
					value: 8
				}).length;
			})), s = String(String).split("String"), a = t.exports = function (t, n, a) {
				if ("Symbol(" === String(n).slice(0, 7) && (n = "[" + String(n).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"),
					a && a.getter && (n = "get " + n), a && a.setter && (n = "set " + n), (!w(t, "name") || e && t.name !== n) && i(t, "name", {
						value: n,
						configurable: !0
					}), o && a && w(a, "arity") && t.length !== a.arity && i(t, "length", {
						value: a.arity
					}), a && w(a, "constructor") && a.constructor) {
					if (H) try {
						i(t, "prototype", {
							writable: !1
						});
					} catch (t) { }
				} else t.prototype = void 0;
				var c = r(t);
				return w(c, "source") || (c.source = s.join("string" == typeof n ? n : "")), t;
			};
			Function.prototype.toString = a((function () {
				return T(this) && n(this).source || _t(this);
			}), "toString");
		})), Ht = function (t, e, r, n) {
			n || (n = {});
			var i = n.enumerable, o = void 0 !== n.name ? n.name : e;
			return T(r) && Xt(r, o, n), n.global ? i ? t[e] = r : a(e, r) : (n.unsafe ? t[e] && (i = !0) : delete t[e],
				i ? t[e] = r : Et(t, e, r)), t;
		}, qt = g({}.toString), Yt = g("".slice), Gt = function (t) {
			return Yt(qt(t), 8, -1);
		}, Ut = V("toStringTag"), Kt = o.Object, Jt = "Arguments" == Gt(function () {
			return arguments;
		}()), Qt = X ? Gt : function (t) {
			var e, r, n;
			return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (r = function (t, e) {
				try {
					return t[e];
				} catch (t) { }
			}(e = Kt(t), Ut)) ? r : Jt ? Gt(e) : "Object" == (n = Gt(e)) && T(e.callee) ? "Arguments" : n;
		}, Zt = X ? {}.toString : function () {
			return "[object " + Qt(this) + "]";
		};
		X || Ht(Object.prototype, "toString", Zt, {
			unsafe: !0
		});
		var te = {
			CSSRuleList: 0,
			CSSStyleDeclaration: 0,
			CSSValueList: 0,
			ClientRectList: 0,
			DOMRectList: 0,
			DOMStringList: 0,
			DOMTokenList: 1,
			DataTransferItemList: 0,
			FileList: 0,
			HTMLAllCollection: 0,
			HTMLCollection: 0,
			HTMLFormElement: 0,
			HTMLSelectElement: 0,
			MediaList: 0,
			MimeTypeArray: 0,
			NamedNodeMap: 0,
			NodeList: 1,
			PaintRequestList: 0,
			Plugin: 0,
			PluginArray: 0,
			SVGLengthList: 0,
			SVGNumberList: 0,
			SVGPathSegList: 0,
			SVGPointList: 0,
			SVGStringList: 0,
			SVGTransformList: 0,
			SourceBufferList: 0,
			StyleSheetList: 0,
			TextTrackCueList: 0,
			TextTrackList: 0,
			TouchList: 0
		}, ee = U("span").classList, re = ee && ee.constructor && ee.constructor.prototype, ne = re === Object.prototype ? void 0 : re, ie = g(g.bind), oe = function (t, e) {
			return lt(t), void 0 === e ? t : f ? ie(t, e) : function () {
				return t.apply(e, arguments);
			};
		}, se = o.Object, ae = g("".split), ce = u((function () {
			return !se("z").propertyIsEnumerable(0);
		})) ? function (t) {
			return "String" == Gt(t) ? ae(t, "") : se(t);
		} : se, le = Math.ceil, ue = Math.floor, fe = Math.trunc || function (t) {
			var e = +t;
			return (e > 0 ? ue : le)(e);
		}, he = function (t) {
			var e = +t;
			return e != e || 0 === e ? 0 : fe(e);
		}, de = Math.min, pe = function (t) {
			return t > 0 ? de(he(t), 9007199254740991) : 0;
		}, ve = function (t) {
			return pe(t.length);
		}, ge = Array.isArray || function (t) {
			return "Array" == Gt(t);
		}, be = function () { }, ye = [], me = R("Reflect", "construct"), xe = /^\s*(?:class|function)\b/, Ee = g(xe.exec), we = !xe.exec(be), Oe = function (t) {
			if (!T(t)) return !1;
			try {
				return me(be, ye, t), !0;
			} catch (t) {
				return !1;
			}
		}, Se = function (t) {
			if (!T(t)) return !1;
			switch (Qt(t)) {
				case "AsyncFunction":
				case "GeneratorFunction":
				case "AsyncGeneratorFunction":
					return !1;
			}
			try {
				return we || !!Ee(xe, _t(t));
			} catch (t) {
				return !0;
			}
		};
		Se.sham = !0;
		var Ae = !me || u((function () {
			var t;
			return Oe(Oe.call) || !Oe(Object) || !Oe((function () {
				t = !0;
			})) || t;
		})) ? Se : Oe, ke = V("species"), Te = o.Array, Le = function (t, e) {
			return new (function (t) {
				var e;
				return ge(t) && (e = t.constructor, (Ae(e) && (e === Te || ge(e.prototype)) || q(e) && null === (e = e[ke])) && (e = void 0)),
					void 0 === e ? Te : e;
			}(t))(0 === e ? 0 : e);
		}, Re = g([].push), _e = function (t) {
			var e = 1 == t, r = 2 == t, n = 3 == t, i = 4 == t, o = 6 == t, s = 7 == t, a = 5 == t || o;
			return function (c, l, u, f) {
				for (var h, d, p = x(c), v = ce(p), g = oe(l, u), b = ve(v), y = 0, m = f || Le, E = e ? m(c, b) : r || s ? m(c, 0) : void 0; b > y; y++) if ((a || y in v) && (d = g(h = v[y], y, p),
					t)) if (e) E[y] = d; else if (d) switch (t) {
						case 3:
							return !0;

						case 5:
							return h;

						case 6:
							return y;

						case 2:
							Re(E, h);
					} else switch (t) {
						case 4:
							return !1;

						case 7:
							Re(E, h);
					}
				return o ? -1 : n || i ? i : E;
			};
		}, je = {
			forEach: _e(0),
			map: _e(1),
			filter: _e(2),
			some: _e(3),
			every: _e(4),
			find: _e(5),
			findIndex: _e(6),
			filterReject: _e(7)
		}, ze = function (t, e) {
			var r = [][t];
			return !!r && u((function () {
				r.call(null, e || function () {
					return 1;
				}, 1);
			}));
		}, Me = je.forEach, Ce = ze("forEach") ? [].forEach : function (t) {
			return Me(this, t, arguments.length > 1 ? arguments[1] : void 0);
		}, Ne = function (t) {
			if (t && t.forEach !== Ce) try {
				Et(t, "forEach", Ce);
			} catch (e) {
				t.forEach = Ce;
			}
		};
		for (var We in te) te[We] && Ne(o[We] && o[We].prototype);
		Ne(ne);
		var Ie = !("undefined" == typeof window || !window.document || !window.document.createElement), Pe = {}.propertyIsEnumerable, Be = Object.getOwnPropertyDescriptor, De = {
			f: Be && !Pe.call({
				1: 2
			}, 1) ? function (t) {
				var e = Be(this, t);
				return !!e && e.enumerable;
			} : Pe
		}, Fe = function (t) {
			return ce(y(t));
		}, Ve = Object.getOwnPropertyDescriptor, $e = {
			f: H ? Ve : function (t, e) {
				if (t = Fe(t), e = vt(e), K) try {
					return Ve(t, e);
				} catch (t) { }
				if (w(t, e)) return xt(!rt(De.f, t, e), t[e]);
			}
		}, Xe = Math.max, He = Math.min, qe = function (t, e) {
			var r = he(t);
			return r < 0 ? Xe(r + e, 0) : He(r, e);
		}, Ye = function (t) {
			return function (e, r, n) {
				var i, o = Fe(e), s = ve(o), a = qe(n, s);
				if (t && r != r) {
					for (; s > a;) if ((i = o[a++]) != i) return !0;
				} else for (; s > a; a++) if ((t || a in o) && o[a] === r) return t || a || 0;
				return !t && -1;
			};
		}, Ge = {
			includes: Ye(!0),
			indexOf: Ye(!1)
		}.indexOf, Ue = g([].push), Ke = function (t, e) {
			var r, n = Fe(t), i = 0, o = [];
			for (r in n) !w(Nt, r) && w(n, r) && Ue(o, r);
			for (; e.length > i;) w(n, r = e[i++]) && (~Ge(o, r) || Ue(o, r));
			return o;
		}, Je = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"], Qe = Je.concat("length", "prototype"), Ze = {
			f: Object.getOwnPropertyNames || function (t) {
				return Ke(t, Qe);
			}
		}, tr = {
			f: Object.getOwnPropertySymbols
		}, er = g([].concat), rr = R("Reflect", "ownKeys") || function (t) {
			var e = Ze.f(tt(t)), r = tr.f;
			return r ? er(e, r(t)) : e;
		}, nr = function (t, e, r) {
			for (var n = rr(e), i = mt.f, o = $e.f, s = 0; s < n.length; s++) {
				var a = n[s];
				w(t, a) || r && w(r, a) || i(t, a, o(e, a));
			}
		}, ir = /#|\.prototype\./, or = function (t, e) {
			var r = ar[sr(t)];
			return r == lr || r != cr && (T(e) ? u(e) : !!e);
		}, sr = or.normalize = function (t) {
			return String(t).replace(ir, ".").toLowerCase();
		}, ar = or.data = {}, cr = or.NATIVE = "N", lr = or.POLYFILL = "P", ur = or, fr = $e.f, hr = function (t, e) {
			var r, n, i, s, c, l = t.target, u = t.global, f = t.stat;
			if (r = u ? o : f ? o[l] || a(l, {}) : (o[l] || {}).prototype) for (n in e) {
				if (s = e[n], i = t.dontCallGetSet ? (c = fr(r, n)) && c.value : r[n], !ur(u ? n : l + (f ? "." : "#") + n, t.forced) && void 0 !== i) {
					if (typeof s == typeof i) continue;
					nr(s, i);
				}
				(t.sham || i && i.sham) && Et(s, "sham", !0), Ht(r, n, s, t);
			}
		}, dr = o.String, pr = function (t) {
			if ("Symbol" === Qt(t)) throw TypeError("Cannot convert a Symbol value to a string");
			return dr(t);
		}, vr = "\t\n\v\f\r                　\u2028\u2029\ufeff", gr = g("".replace), br = "[" + vr + "]", yr = RegExp("^" + br + br + "*"), mr = RegExp(br + br + "*$"), xr = function (t) {
			return function (e) {
				var r = pr(y(e));
				return 1 & t && (r = gr(r, yr, "")), 2 & t && (r = gr(r, mr, "")), r;
			};
		}, Er = {
			start: xr(1),
			end: xr(2),
			trim: xr(3)
		}.trim, wr = o.parseInt, Or = o.Symbol, Sr = Or && Or.iterator, Ar = /^[+-]?0x/i, kr = g(Ar.exec), Tr = 8 !== wr(vr + "08") || 22 !== wr(vr + "0x16") || Sr && !u((function () {
			wr(Object(Sr));
		})) ? function (t, e) {
			var r = Er(pr(t));
			return wr(r, e >>> 0 || (kr(Ar, r) ? 16 : 10));
		} : wr;
		hr({
			global: !0,
			forced: parseInt != Tr
		}, {
			parseInt: Tr
		});
		var Lr = Object.keys || function (t) {
			return Ke(t, Je);
		}, Rr = Object.assign, _r = Object.defineProperty, jr = g([].concat), zr = !Rr || u((function () {
			if (H && 1 !== Rr({
				b: 1
			}, Rr(_r({}, "a", {
				enumerable: !0,
				get: function () {
					_r(this, "b", {
						value: 3,
						enumerable: !1
					});
				}
			}), {
				b: 2
			})).b) return !0;
			var t = {}, e = {}, r = Symbol();
			return t[r] = 7, "abcdefghijklmnopqrst".split("").forEach((function (t) {
				e[t] = t;
			})), 7 != Rr({}, t)[r] || "abcdefghijklmnopqrst" != Lr(Rr({}, e)).join("");
		})) ? function (t, e) {
			for (var r = x(t), n = arguments.length, i = 1, o = tr.f, s = De.f; n > i;) for (var a, c = ce(arguments[i++]), l = o ? jr(Lr(c), o(c)) : Lr(c), u = l.length, f = 0; u > f;) a = l[f++],
				H && !rt(s, c, a) || (r[a] = c[a]);
			return r;
		} : Rr;
		hr({
			target: "Object",
			stat: !0,
			arity: 2,
			forced: Object.assign !== zr
		}, {
			assign: zr
		});
		var Mr, Cr = V("species"), Nr = je.filter, Wr = (Mr = "filter", N >= 51 || !u((function () {
			var t = [];
			return (t.constructor = {})[Cr] = function () {
				return {
					foo: 1
				};
			}, 1 !== t[Mr](Boolean).foo;
		})));
		hr({
			target: "Array",
			proto: !0,
			forced: !Wr
		}, {
			filter: function (t) {
				return Nr(this, t, arguments.length > 1 ? arguments[1] : void 0);
			}
		});
		var Ir, Pr = {
			f: H && !J ? Object.defineProperties : function (t, e) {
				tt(t);
				for (var r, n = Fe(e), i = Lr(e), o = i.length, s = 0; o > s;) mt.f(t, r = i[s++], n[r]);
				return t;
			}
		}, Br = R("document", "documentElement"), Dr = Ct("IE_PROTO"), Fr = function () { }, Vr = function (t) {
			return "<script>" + t + "<\/script>";
		}, $r = function (t) {
			t.write(Vr("")), t.close();
			var e = t.parentWindow.Object;
			return t = null, e;
		}, Xr = function () {
			try {
				Ir = new ActiveXObject("htmlfile");
			} catch (t) { }
			var t, e;
			Xr = "undefined" != typeof document ? document.domain && Ir ? $r(Ir) : ((e = U("iframe")).style.display = "none",
				Br.appendChild(e), e.src = String("javascript:"), (t = e.contentWindow.document).open(),
				t.write(Vr("document.F=Object")), t.close(), t.F) : $r(Ir);
			for (var r = Je.length; r--;) delete Xr.prototype[Je[r]];
			return Xr();
		};
		Nt[Dr] = !0;
		var Hr = Object.create || function (t, e) {
			var r;
			return null !== t ? (Fr.prototype = tt(t), r = new Fr, Fr.prototype = null, r[Dr] = t) : r = Xr(),
				void 0 === e ? r : Pr.f(r, e);
		}, qr = mt.f, Yr = V("unscopables"), Gr = Array.prototype;
		null == Gr[Yr] && qr(Gr, Yr, {
			configurable: !0,
			value: Hr(null)
		});
		var Ur, Kr, Jr, Qr = function (t) {
			Gr[Yr][t] = !0;
		}, Zr = {}, tn = !u((function () {
			function t() { }
			return t.prototype.constructor = null, Object.getPrototypeOf(new t) !== t.prototype;
		})), en = Ct("IE_PROTO"), rn = o.Object, nn = rn.prototype, on = tn ? rn.getPrototypeOf : function (t) {
			var e = x(t);
			if (w(e, en)) return e[en];
			var r = e.constructor;
			return T(r) && e instanceof r ? r.prototype : e instanceof rn ? nn : null;
		}, sn = V("iterator"), an = !1;
		[].keys && ("next" in (Jr = [].keys()) ? (Kr = on(on(Jr))) !== Object.prototype && (Ur = Kr) : an = !0),
			(null == Ur || u((function () {
				var t = {};
				return Ur[sn].call(t) !== t;
			}))) && (Ur = {}), T(Ur[sn]) || Ht(Ur, sn, (function () {
				return this;
			}));
		var cn = {
			IteratorPrototype: Ur,
			BUGGY_SAFARI_ITERATORS: an
		}, ln = mt.f, un = V("toStringTag"), fn = function (t, e, r) {
			t && !r && (t = t.prototype), t && !w(t, un) && ln(t, un, {
				configurable: !0,
				value: e
			});
		}, hn = cn.IteratorPrototype, dn = function () {
			return this;
		}, pn = o.String, vn = o.TypeError, gn = Object.setPrototypeOf || ("__proto__" in {} ? function () {
			var t, e = !1, r = {};
			try {
				(t = g(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set))(r, []),
					e = r instanceof Array;
			} catch (t) { }
			return function (r, n) {
				return tt(r), function (t) {
					if ("object" == typeof t || T(t)) return t;
					throw vn("Can't set " + pn(t) + " as a prototype");
				}(n), e ? t(r, n) : r.__proto__ = n, r;
			};
		}() : void 0), bn = At.PROPER, yn = At.CONFIGURABLE, mn = cn.IteratorPrototype, xn = cn.BUGGY_SAFARI_ITERATORS, En = V("iterator"), wn = function () {
			return this;
		}, On = function (t, e, r, n, i, o, s) {
			!function (t, e, r, n) {
				var i = e + " Iterator";
				t.prototype = Hr(hn, {
					next: xt(+!n, r)
				}), fn(t, i, !1), Zr[i] = dn;
			}(r, e, n);
			var a, c, l, u = function (t) {
				if (t === i && v) return v;
				if (!xn && t in d) return d[t];
				switch (t) {
					case "keys":
					case "values":
					case "entries":
						return function () {
							return new r(this, t);
						};
				}
				return function () {
					return new r(this);
				};
			}, f = e + " Iterator", h = !1, d = t.prototype, p = d[En] || d["@@iterator"] || i && d[i], v = !xn && p || u(i), g = "Array" == e && d.entries || p;
			if (g && (a = on(g.call(new t))) !== Object.prototype && a.next && (on(a) !== mn && (gn ? gn(a, mn) : T(a[En]) || Ht(a, En, wn)),
				fn(a, f, !0)), bn && "values" == i && p && "values" !== p.name && (yn ? Et(d, "name", "values") : (h = !0,
					v = function () {
						return rt(p, this);
					})), i) if (c = {
						values: u("values"),
						keys: o ? v : u("keys"),
						entries: u("entries")
					}, s) for (l in c) (xn || h || !(l in d)) && Ht(d, l, c[l]); else hr({
						target: e,
						proto: !0,
						forced: xn || h
					}, c);
			return d[En] !== v && Ht(d, En, v, {
				name: i
			}), Zr[e] = v, c;
		}, Sn = mt.f, An = $t.set, kn = $t.getterFor("Array Iterator"), Tn = On(Array, "Array", (function (t, e) {
			An(this, {
				type: "Array Iterator",
				target: Fe(t),
				index: 0,
				kind: e
			});
		}), (function () {
			var t = kn(this), e = t.target, r = t.kind, n = t.index++;
			return !e || n >= e.length ? (t.target = void 0, {
				value: void 0,
				done: !0
			}) : "keys" == r ? {
				value: n,
				done: !1
			} : "values" == r ? {
				value: e[n],
				done: !1
			} : {
				value: [n, e[n]],
				done: !1
			};
		}), "values"), Ln = Zr.Arguments = Zr.Array;
		if (Qr("keys"), Qr("values"), Qr("entries"), H && "values" !== Ln.name) try {
			Sn(Ln, "name", {
				value: "values"
			});
		} catch (t) { }
		var Rn = g("".charAt), _n = g("".charCodeAt), jn = g("".slice), zn = function (t) {
			return function (e, r) {
				var n, i, o = pr(y(e)), s = he(r), a = o.length;
				return s < 0 || s >= a ? t ? "" : void 0 : (n = _n(o, s)) < 55296 || n > 56319 || s + 1 === a || (i = _n(o, s + 1)) < 56320 || i > 57343 ? t ? Rn(o, s) : n : t ? jn(o, s, s + 2) : i - 56320 + (n - 55296 << 10) + 65536;
			};
		}, Mn = {
			codeAt: zn(!1),
			charAt: zn(!0)
		}, Cn = Mn.charAt, Nn = $t.set, Wn = $t.getterFor("String Iterator");
		On(String, "String", (function (t) {
			Nn(this, {
				type: "String Iterator",
				string: pr(t),
				index: 0
			});
		}), (function () {
			var t, e = Wn(this), r = e.string, n = e.index;
			return n >= r.length ? {
				value: void 0,
				done: !0
			} : (t = Cn(r, n), e.index += t.length, {
				value: t,
				done: !1
			});
		}));
		var In = function (t, e, r) {
			for (var n in e) Ht(t, n, e[n], r);
			return t;
		}, Pn = o.Array, Bn = Math.max, Dn = Ze.f, Fn = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], Vn = function (t) {
			try {
				return Dn(t);
			} catch (t) {
				return function (t, e, r) {
					for (var n, i, o, s, a = ve(t), c = qe(e, a), l = qe(void 0 === r ? a : r, a), u = Pn(Bn(l - c, 0)), f = 0; c < l; c++,
						f++) n = u, i = f, o = t[c], s = void 0, (s = vt(i)) in n ? mt.f(n, s, xt(0, o)) : n[s] = o;
					return u.length = f, u;
				}(Fn);
			}
		}, $n = {
			f: function (t) {
				return Fn && "Window" == Gt(t) ? Vn(t) : Dn(Fe(t));
			}
		}, Xn = u((function () {
			if ("function" == typeof ArrayBuffer) {
				var t = new ArrayBuffer(8);
				Object.isExtensible(t) && Object.defineProperty(t, "a", {
					value: 8
				});
			}
		})), Hn = Object.isExtensible, qn = u((function () {
			Hn(1);
		})) || Xn ? function (t) {
			return !!q(t) && (!Xn || "ArrayBuffer" != Gt(t)) && (!Hn || Hn(t));
		} : Hn, Yn = !u((function () {
			return Object.isExtensible(Object.preventExtensions({}));
		})), Gn = e((function (t) {
			var e = mt.f, r = !1, n = k("meta"), i = 0, o = function (t) {
				e(t, n, {
					value: {
						objectID: "O" + i++,
						weakData: {}
					}
				});
			}, s = t.exports = {
				enable: function () {
					s.enable = function () { }, r = !0;
					var t = Ze.f, e = g([].splice), i = {};
					i[n] = 1, t(i).length && (Ze.f = function (r) {
						for (var i = t(r), o = 0, s = i.length; o < s; o++) if (i[o] === n) {
							e(i, o, 1);
							break;
						}
						return i;
					}, hr({
						target: "Object",
						stat: !0,
						forced: !0
					}, {
						getOwnPropertyNames: $n.f
					}));
				},
				fastKey: function (t, e) {
					if (!q(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
					if (!w(t, n)) {
						if (!qn(t)) return "F";
						if (!e) return "E";
						o(t);
					}
					return t[n].objectID;
				},
				getWeakData: function (t, e) {
					if (!w(t, n)) {
						if (!qn(t)) return !0;
						if (!e) return !1;
						o(t);
					}
					return t[n].weakData;
				},
				onFreeze: function (t) {
					return Yn && r && qn(t) && !w(t, n) && o(t), t;
				}
			};
			Nt[n] = !0;
		})), Un = (Gn.enable, Gn.fastKey, Gn.getWeakData, Gn.onFreeze, V("iterator")), Kn = Array.prototype, Jn = V("iterator"), Qn = function (t) {
			if (null != t) return ut(t, Jn) || ut(t, "@@iterator") || Zr[Qt(t)];
		}, Zn = o.TypeError, ti = function (t, e, r) {
			var n, i;
			tt(t);
			try {
				if (!(n = ut(t, "return"))) {
					if ("throw" === e) throw r;
					return r;
				}
				n = rt(n, t);
			} catch (t) {
				i = !0, n = t;
			}
			if ("throw" === e) throw r;
			if (i) throw n;
			return tt(n), r;
		}, ei = o.TypeError, ri = function (t, e) {
			this.stopped = t, this.result = e;
		}, ni = ri.prototype, ii = function (t, e, r) {
			var n, i, o, s, a, c, l, u, f = r && r.that, h = !(!r || !r.AS_ENTRIES), d = !(!r || !r.IS_ITERATOR), p = !(!r || !r.INTERRUPTED), v = oe(e, f), g = function (t) {
				return n && ti(n, "normal", t), new ri(!0, t);
			}, b = function (t) {
				return h ? (tt(t), p ? v(t[0], t[1], g) : v(t[0], t[1])) : p ? v(t, g) : v(t);
			};
			if (d) n = t; else {
				if (!(i = Qn(t))) throw ei(at(t) + " is not iterable");
				if (void 0 !== (u = i) && (Zr.Array === u || Kn[Un] === u)) {
					for (o = 0, s = ve(t); s > o; o++) if ((a = b(t[o])) && nt(ni, a)) return a;
					return new ri(!1);
				}
				n = function (t, e) {
					var r = arguments.length < 2 ? Qn(t) : e;
					if (lt(r)) return tt(rt(r, t));
					throw Zn(at(t) + " is not iterable");
				}(t, i);
			}
			for (c = n.next; !(l = rt(c, n)).done;) {
				try {
					a = b(l.value);
				} catch (t) {
					ti(n, "throw", t);
				}
				if ("object" == typeof a && a && nt(ni, a)) return a;
			}
			return new ri(!1);
		}, oi = o.TypeError, si = function (t, e) {
			if (nt(e, t)) return t;
			throw oi("Incorrect invocation");
		}, ai = V("iterator"), ci = !1;
		try {
			var li = 0, ui = {
				next: function () {
					return {
						done: !!li++
					};
				},
				return: function () {
					ci = !0;
				}
			};
			ui[ai] = function () {
				return this;
			}, Array.from(ui, (function () {
				throw 2;
			}));
		} catch (t) { }
		var fi = Gn.getWeakData, hi = $t.set, di = $t.getterFor, pi = je.find, vi = je.findIndex, gi = g([].splice), bi = 0, yi = function (t) {
			return t.frozen || (t.frozen = new mi);
		}, mi = function () {
			this.entries = [];
		}, xi = function (t, e) {
			return pi(t.entries, (function (t) {
				return t[0] === e;
			}));
		};
		mi.prototype = {
			get: function (t) {
				var e = xi(this, t);
				if (e) return e[1];
			},
			has: function (t) {
				return !!xi(this, t);
			},
			set: function (t, e) {
				var r = xi(this, t);
				r ? r[1] = e : this.entries.push([t, e]);
			},
			delete: function (t) {
				var e = vi(this.entries, (function (e) {
					return e[0] === t;
				}));
				return ~e && gi(this.entries, e, 1), !!~e;
			}
		};
		var Ei, wi = {
			getConstructor: function (t, e, r, n) {
				var i = t((function (t, i) {
					si(t, o), hi(t, {
						type: e,
						id: bi++,
						frozen: void 0
					}), null != i && ii(i, t[n], {
						that: t,
						AS_ENTRIES: r
					});
				})), o = i.prototype, s = di(e), a = function (t, e, r) {
					var n = s(t), i = fi(tt(e), !0);
					return !0 === i ? yi(n).set(e, r) : i[n.id] = r, t;
				};
				return In(o, {
					delete: function (t) {
						var e = s(this);
						if (!q(t)) return !1;
						var r = fi(t);
						return !0 === r ? yi(e).delete(t) : r && w(r, e.id) && delete r[e.id];
					},
					has: function (t) {
						var e = s(this);
						if (!q(t)) return !1;
						var r = fi(t);
						return !0 === r ? yi(e).has(t) : r && w(r, e.id);
					}
				}), In(o, r ? {
					get: function (t) {
						var e = s(this);
						if (q(t)) {
							var r = fi(t);
							return !0 === r ? yi(e).get(t) : r ? r[e.id] : void 0;
						}
					},
					set: function (t, e) {
						return a(this, t, e);
					}
				} : {
					add: function (t) {
						return a(this, t, !0);
					}
				}), i;
			}
		}, Oi = $t.enforce, Si = !o.ActiveXObject && "ActiveXObject" in o, Ai = function (t) {
			return function () {
				return t(this, arguments.length ? arguments[0] : void 0);
			};
		}, ki = function (t, e, r) {
			var n = -1 !== t.indexOf("Map"), i = -1 !== t.indexOf("Weak"), s = n ? "set" : "add", a = o[t], c = a && a.prototype, l = a, f = {}, h = function (t) {
				var e = g(c[t]);
				Ht(c, t, "add" == t ? function (t) {
					return e(this, 0 === t ? 0 : t), this;
				} : "delete" == t ? function (t) {
					return !(i && !q(t)) && e(this, 0 === t ? 0 : t);
				} : "get" == t ? function (t) {
					return i && !q(t) ? void 0 : e(this, 0 === t ? 0 : t);
				} : "has" == t ? function (t) {
					return !(i && !q(t)) && e(this, 0 === t ? 0 : t);
				} : function (t, r) {
					return e(this, 0 === t ? 0 : t, r), this;
				});
			};
			if (ur(t, !T(a) || !(i || c.forEach && !u((function () {
				(new a).entries().next();
			}))))) l = r.getConstructor(e, t, n, s), Gn.enable(); else if (ur(t, !0)) {
				var d = new l, p = d[s](i ? {} : -0, 1) != d, v = u((function () {
					d.has(1);
				})), b = function (t, e) {
					if (!e && !ci) return !1;
					var r = !1;
					try {
						var n = {};
						n[ai] = function () {
							return {
								next: function () {
									return {
										done: r = !0
									};
								}
							};
						}, t(n);
					} catch (t) { }
					return r;
				}((function (t) {
					new a(t);
				})), y = !i && u((function () {
					for (var t = new a, e = 5; e--;) t[s](e, e);
					return !t.has(-0);
				}));
				b || ((l = e((function (t, e) {
					si(t, c);
					var r = function (t, e, r) {
						var n, i;
						return gn && T(n = e.constructor) && n !== r && q(i = n.prototype) && i !== r.prototype && gn(t, i),
							t;
					}(new a, t, l);
					return null != e && ii(e, r[s], {
						that: r,
						AS_ENTRIES: n
					}), r;
				}))).prototype = c, c.constructor = l), (v || y) && (h("delete"), h("has"), n && h("get")),
					(y || p) && h(s), i && c.clear && delete c.clear;
			}
			return f[t] = l, hr({
				global: !0,
				constructor: !0,
				forced: l != a
			}, f), fn(l, t), i || r.setStrong(l, t, n), l;
		}("WeakMap", Ai, wi);
		if (zt && Si) {
			Ei = wi.getConstructor(Ai, "WeakMap", !0), Gn.enable();
			var Ti = ki.prototype, Li = g(Ti.delete), Ri = g(Ti.has), _i = g(Ti.get), ji = g(Ti.set);
			In(Ti, {
				delete: function (t) {
					if (q(t) && !qn(t)) {
						var e = Oi(this);
						return e.frozen || (e.frozen = new Ei), Li(this, t) || e.frozen.delete(t);
					}
					return Li(this, t);
				},
				has: function (t) {
					if (q(t) && !qn(t)) {
						var e = Oi(this);
						return e.frozen || (e.frozen = new Ei), Ri(this, t) || e.frozen.has(t);
					}
					return Ri(this, t);
				},
				get: function (t) {
					if (q(t) && !qn(t)) {
						var e = Oi(this);
						return e.frozen || (e.frozen = new Ei), Ri(this, t) ? _i(this, t) : e.frozen.get(t);
					}
					return _i(this, t);
				},
				set: function (t, e) {
					if (q(t) && !qn(t)) {
						var r = Oi(this);
						r.frozen || (r.frozen = new Ei), Ri(this, t) ? ji(this, t, e) : r.frozen.set(t, e);
					} else ji(this, t, e);
					return this;
				}
			});
		}
		var zi = V("iterator"), Mi = V("toStringTag"), Ci = Tn.values, Ni = function (t, e) {
			if (t) {
				if (t[zi] !== Ci) try {
					Et(t, zi, Ci);
				} catch (e) {
					t[zi] = Ci;
				}
				if (t[Mi] || Et(t, Mi, e), te[e]) for (var r in Tn) if (t[r] !== Tn[r]) try {
					Et(t, r, Tn[r]);
				} catch (e) {
					t[r] = Tn[r];
				}
			}
		};
		for (var Wi in te) Ni(o[Wi] && o[Wi].prototype, Wi);
		Ni(ne, "DOMTokenList");
		var Ii = /^\s+|\s+$/g, Pi = /^[-+]0x[0-9a-f]+$/i, Bi = /^0b[01]+$/i, Di = /^0o[0-7]+$/i, Fi = parseInt, Vi = "object" == typeof t && t && t.Object === Object && t, $i = "object" == typeof self && self && self.Object === Object && self, Xi = Vi || $i || Function("return this")(), Hi = Object.prototype.toString, qi = Math.max, Yi = Math.min, Gi = function () {
			return Xi.Date.now();
		};
		function Ui(t, e, r) {
			var n, i, o, s, a, c, l = 0, u = !1, f = !1, h = !0;
			if ("function" != typeof t) throw new TypeError("Expected a function");
			function d(e) {
				var r = n, o = i;
				return n = i = void 0, l = e, s = t.apply(o, r);
			}
			function p(t) {
				return l = t, a = setTimeout(g, e), u ? d(t) : s;
			}
			function v(t) {
				var r = t - c;
				return void 0 === c || r >= e || r < 0 || f && t - l >= o;
			}
			function g() {
				var t = Gi();
				if (v(t)) return b(t);
				a = setTimeout(g, function (t) {
					var r = e - (t - c);
					return f ? Yi(r, o - (t - l)) : r;
				}(t));
			}
			function b(t) {
				return a = void 0, h && n ? d(t) : (n = i = void 0, s);
			}
			function y() {
				var t = Gi(), r = v(t);
				if (n = arguments, i = this, c = t, r) {
					if (void 0 === a) return p(c);
					if (f) return a = setTimeout(g, e), d(c);
				}
				return void 0 === a && (a = setTimeout(g, e)), s;
			}
			return e = Ji(e) || 0, Ki(r) && (u = !!r.leading, o = (f = "maxWait" in r) ? qi(Ji(r.maxWait) || 0, e) : o,
				h = "trailing" in r ? !!r.trailing : h), y.cancel = function () {
					void 0 !== a && clearTimeout(a), l = 0, n = c = i = a = void 0;
				}, y.flush = function () {
					return void 0 === a ? s : b(Gi());
				}, y;
		}
		function Ki(t) {
			var e = typeof t;
			return !!t && ("object" == e || "function" == e);
		}
		function Ji(t) {
			if ("number" == typeof t) return t;
			if (function (t) {
				return "symbol" == typeof t || function (t) {
					return !!t && "object" == typeof t;
				}(t) && "[object Symbol]" == Hi.call(t);
			}(t)) return NaN;
			if (Ki(t)) {
				var e = "function" == typeof t.valueOf ? t.valueOf() : t;
				t = Ki(e) ? e + "" : e;
			}
			if ("string" != typeof t) return 0 === t ? t : +t;
			t = t.replace(Ii, "");
			var r = Bi.test(t);
			return r || Di.test(t) ? Fi(t.slice(2), r ? 2 : 8) : Pi.test(t) ? NaN : +t;
		}
		var Qi = function (t, e, r) {
			var n = !0, i = !0;
			if ("function" != typeof t) throw new TypeError("Expected a function");
			return Ki(r) && (n = "leading" in r ? !!r.leading : n, i = "trailing" in r ? !!r.trailing : i),
				Ui(t, e, {
					leading: n,
					maxWait: e,
					trailing: i
				});
		}, Zi = /^\s+|\s+$/g, to = /^[-+]0x[0-9a-f]+$/i, eo = /^0b[01]+$/i, ro = /^0o[0-7]+$/i, no = parseInt, io = "object" == typeof t && t && t.Object === Object && t, oo = "object" == typeof self && self && self.Object === Object && self, so = io || oo || Function("return this")(), ao = Object.prototype.toString, co = Math.max, lo = Math.min, uo = function () {
			return so.Date.now();
		};
		function fo(t) {
			var e = typeof t;
			return !!t && ("object" == e || "function" == e);
		}
		function ho(t) {
			if ("number" == typeof t) return t;
			if (function (t) {
				return "symbol" == typeof t || function (t) {
					return !!t && "object" == typeof t;
				}(t) && "[object Symbol]" == ao.call(t);
			}(t)) return NaN;
			if (fo(t)) {
				var e = "function" == typeof t.valueOf ? t.valueOf() : t;
				t = fo(e) ? e + "" : e;
			}
			if ("string" != typeof t) return 0 === t ? t : +t;
			t = t.replace(Zi, "");
			var r = eo.test(t);
			return r || ro.test(t) ? no(t.slice(2), r ? 2 : 8) : to.test(t) ? NaN : +t;
		}
		var po = function (t, e, r) {
			var n, i, o, s, a, c, l = 0, u = !1, f = !1, h = !0;
			if ("function" != typeof t) throw new TypeError("Expected a function");
			function d(e) {
				var r = n, o = i;
				return n = i = void 0, l = e, s = t.apply(o, r);
			}
			function p(t) {
				return l = t, a = setTimeout(g, e), u ? d(t) : s;
			}
			function v(t) {
				var r = t - c;
				return void 0 === c || r >= e || r < 0 || f && t - l >= o;
			}
			function g() {
				var t = uo();
				if (v(t)) return b(t);
				a = setTimeout(g, function (t) {
					var r = e - (t - c);
					return f ? lo(r, o - (t - l)) : r;
				}(t));
			}
			function b(t) {
				return a = void 0, h && n ? d(t) : (n = i = void 0, s);
			}
			function y() {
				var t = uo(), r = v(t);
				if (n = arguments, i = this, c = t, r) {
					if (void 0 === a) return p(c);
					if (f) return a = setTimeout(g, e), d(c);
				}
				return void 0 === a && (a = setTimeout(g, e)), s;
			}
			return e = ho(e) || 0, fo(r) && (u = !!r.leading, o = (f = "maxWait" in r) ? co(ho(r.maxWait) || 0, e) : o,
				h = "trailing" in r ? !!r.trailing : h), y.cancel = function () {
					void 0 !== a && clearTimeout(a), l = 0, n = c = i = a = void 0;
				}, y.flush = function () {
					return void 0 === a ? s : b(uo());
				}, y;
		}, vo = /^\[object .+?Constructor\]$/, go = "object" == typeof t && t && t.Object === Object && t, bo = "object" == typeof self && self && self.Object === Object && self, yo = go || bo || Function("return this")();
		var mo = Array.prototype, xo = Function.prototype, Eo = Object.prototype, wo = yo["__core-js_shared__"], Oo = function () {
			var t = /[^.]+$/.exec(wo && wo.keys && wo.keys.IE_PROTO || "");
			return t ? "Symbol(src)_1." + t : "";
		}(), So = xo.toString, Ao = Eo.hasOwnProperty, ko = Eo.toString, To = RegExp("^" + So.call(Ao).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Lo = mo.splice, Ro = Io(yo, "Map"), _o = Io(Object, "create");
		function jo(t) {
			var e = -1, r = t ? t.length : 0;
			for (this.clear(); ++e < r;) {
				var n = t[e];
				this.set(n[0], n[1]);
			}
		}
		function zo(t) {
			var e = -1, r = t ? t.length : 0;
			for (this.clear(); ++e < r;) {
				var n = t[e];
				this.set(n[0], n[1]);
			}
		}
		function Mo(t) {
			var e = -1, r = t ? t.length : 0;
			for (this.clear(); ++e < r;) {
				var n = t[e];
				this.set(n[0], n[1]);
			}
		}
		function Co(t, e) {
			for (var r, n, i = t.length; i--;) if ((r = t[i][0]) === (n = e) || r != r && n != n) return i;
			return -1;
		}
		function No(t) {
			return !(!Bo(t) || (e = t, Oo && Oo in e)) && (function (t) {
				var e = Bo(t) ? ko.call(t) : "";
				return "[object Function]" == e || "[object GeneratorFunction]" == e;
			}(t) || function (t) {
				var e = !1;
				if (null != t && "function" != typeof t.toString) try {
					e = !!(t + "");
				} catch (t) { }
				return e;
			}(t) ? To : vo).test(function (t) {
				if (null != t) {
					try {
						return So.call(t);
					} catch (t) { }
					try {
						return t + "";
					} catch (t) { }
				}
				return "";
			}(t));
			var e;
		}
		function Wo(t, e) {
			var r, n, i = t.__data__;
			return ("string" == (n = typeof (r = e)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r) ? i["string" == typeof e ? "string" : "hash"] : i.map;
		}
		function Io(t, e) {
			var r = function (t, e) {
				return null == t ? void 0 : t[e];
			}(t, e);
			return No(r) ? r : void 0;
		}
		function Po(t, e) {
			if ("function" != typeof t || e && "function" != typeof e) throw new TypeError("Expected a function");
			var r = function () {
				var n = arguments, i = e ? e.apply(this, n) : n[0], o = r.cache;
				if (o.has(i)) return o.get(i);
				var s = t.apply(this, n);
				return r.cache = o.set(i, s), s;
			};
			return r.cache = new (Po.Cache || Mo), r;
		}
		function Bo(t) {
			var e = typeof t;
			return !!t && ("object" == e || "function" == e);
		}
		jo.prototype.clear = function () {
			this.__data__ = _o ? _o(null) : {};
		}, jo.prototype.delete = function (t) {
			return this.has(t) && delete this.__data__[t];
		}, jo.prototype.get = function (t) {
			var e = this.__data__;
			if (_o) {
				var r = e[t];
				return "__lodash_hash_undefined__" === r ? void 0 : r;
			}
			return Ao.call(e, t) ? e[t] : void 0;
		}, jo.prototype.has = function (t) {
			var e = this.__data__;
			return _o ? void 0 !== e[t] : Ao.call(e, t);
		}, jo.prototype.set = function (t, e) {
			return this.__data__[t] = _o && void 0 === e ? "__lodash_hash_undefined__" : e,
				this;
		}, zo.prototype.clear = function () {
			this.__data__ = [];
		}, zo.prototype.delete = function (t) {
			var e = this.__data__, r = Co(e, t);
			return !(r < 0) && (r == e.length - 1 ? e.pop() : Lo.call(e, r, 1), !0);
		}, zo.prototype.get = function (t) {
			var e = this.__data__, r = Co(e, t);
			return r < 0 ? void 0 : e[r][1];
		}, zo.prototype.has = function (t) {
			return Co(this.__data__, t) > -1;
		}, zo.prototype.set = function (t, e) {
			var r = this.__data__, n = Co(r, t);
			return n < 0 ? r.push([t, e]) : r[n][1] = e, this;
		}, Mo.prototype.clear = function () {
			this.__data__ = {
				hash: new jo,
				map: new (Ro || zo),
				string: new jo
			};
		}, Mo.prototype.delete = function (t) {
			return Wo(this, t).delete(t);
		}, Mo.prototype.get = function (t) {
			return Wo(this, t).get(t);
		}, Mo.prototype.has = function (t) {
			return Wo(this, t).has(t);
		}, Mo.prototype.set = function (t, e) {
			return Wo(this, t).set(t, e), this;
		}, Po.Cache = Mo;
		var Do, Fo = Po, Vo = [], $o = "ResizeObserver loop completed with undelivered notifications.";
		!function (t) {
			t.BORDER_BOX = "border-box", t.CONTENT_BOX = "content-box", t.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
		}(Do || (Do = {}));
		var Xo, Ho = function (t) {
			return Object.freeze(t);
		}, qo = function (t, e) {
			this.inlineSize = t, this.blockSize = e, Ho(this);
		}, Yo = function () {
			function t(t, e, r, n) {
				return this.x = t, this.y = e, this.width = r, this.height = n, this.top = this.y,
					this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width,
					Ho(this);
			}
			return t.prototype.toJSON = function () {
				var t = this;
				return {
					x: t.x,
					y: t.y,
					top: t.top,
					right: t.right,
					bottom: t.bottom,
					left: t.left,
					width: t.width,
					height: t.height
				};
			}, t.fromRect = function (e) {
				return new t(e.x, e.y, e.width, e.height);
			}, t;
		}(), Go = function (t) {
			return t instanceof SVGElement && "getBBox" in t;
		}, Uo = function (t) {
			if (Go(t)) {
				var e = t.getBBox(), r = e.width, n = e.height;
				return !r && !n;
			}
			var i = t, o = i.offsetWidth, s = i.offsetHeight;
			return !(o || s || t.getClientRects().length);
		}, Ko = function (t) {
			var e, r;
			if (t instanceof Element) return !0;
			var n = null === (r = null === (e = t) || void 0 === e ? void 0 : e.ownerDocument) || void 0 === r ? void 0 : r.defaultView;
			return !!(n && t instanceof n.Element);
		}, Jo = "undefined" != typeof window ? window : {}, Qo = new WeakMap, Zo = /auto|scroll/, ts = /^tb|vertical/, es = /msie|trident/i.test(Jo.navigator && Jo.navigator.userAgent), rs = function (t) {
			return parseFloat(t || "0");
		}, ns = function (t, e, r) {
			return void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === r && (r = !1),
				new qo((r ? e : t) || 0, (r ? t : e) || 0);
		}, is = Ho({
			devicePixelContentBoxSize: ns(),
			borderBoxSize: ns(),
			contentBoxSize: ns(),
			contentRect: new Yo(0, 0, 0, 0)
		}), os = function (t, e) {
			if (void 0 === e && (e = !1), Qo.has(t) && !e) return Qo.get(t);
			if (Uo(t)) return Qo.set(t, is), is;
			var r = getComputedStyle(t), n = Go(t) && t.ownerSVGElement && t.getBBox(), i = !es && "border-box" === r.boxSizing, o = ts.test(r.writingMode || ""), s = !n && Zo.test(r.overflowY || ""), a = !n && Zo.test(r.overflowX || ""), c = n ? 0 : rs(r.paddingTop), l = n ? 0 : rs(r.paddingRight), u = n ? 0 : rs(r.paddingBottom), f = n ? 0 : rs(r.paddingLeft), h = n ? 0 : rs(r.borderTopWidth), d = n ? 0 : rs(r.borderRightWidth), p = n ? 0 : rs(r.borderBottomWidth), v = f + l, g = c + u, b = (n ? 0 : rs(r.borderLeftWidth)) + d, y = h + p, m = a ? t.offsetHeight - y - t.clientHeight : 0, x = s ? t.offsetWidth - b - t.clientWidth : 0, E = i ? v + b : 0, w = i ? g + y : 0, O = n ? n.width : rs(r.width) - E - x, S = n ? n.height : rs(r.height) - w - m, A = O + v + x + b, k = S + g + m + y, T = Ho({
				devicePixelContentBoxSize: ns(Math.round(O * devicePixelRatio), Math.round(S * devicePixelRatio), o),
				borderBoxSize: ns(A, k, o),
				contentBoxSize: ns(O, S, o),
				contentRect: new Yo(f, c, O, S)
			});
			return Qo.set(t, T), T;
		}, ss = function (t, e, r) {
			var n = os(t, r), i = n.borderBoxSize, o = n.contentBoxSize, s = n.devicePixelContentBoxSize;
			switch (e) {
				case Do.DEVICE_PIXEL_CONTENT_BOX:
					return s;

				case Do.BORDER_BOX:
					return i;

				default:
					return o;
			}
		}, as = function (t) {
			var e = os(t);
			this.target = t, this.contentRect = e.contentRect, this.borderBoxSize = Ho([e.borderBoxSize]),
				this.contentBoxSize = Ho([e.contentBoxSize]), this.devicePixelContentBoxSize = Ho([e.devicePixelContentBoxSize]);
		}, cs = function (t) {
			if (Uo(t)) return 1 / 0;
			for (var e = 0, r = t.parentNode; r;) e += 1, r = r.parentNode;
			return e;
		}, ls = function () {
			var t = 1 / 0, e = [];
			Vo.forEach((function (r) {
				if (0 !== r.activeTargets.length) {
					var n = [];
					r.activeTargets.forEach((function (e) {
						var r = new as(e.target), i = cs(e.target);
						n.push(r), e.lastReportedSize = ss(e.target, e.observedBox), i < t && (t = i);
					})), e.push((function () {
						r.callback.call(r.observer, n, r.observer);
					})), r.activeTargets.splice(0, r.activeTargets.length);
				}
			}));
			for (var r = 0, n = e; r < n.length; r++) (0, n[r])();
			return t;
		}, us = function (t) {
			Vo.forEach((function (e) {
				e.activeTargets.splice(0, e.activeTargets.length), e.skippedTargets.splice(0, e.skippedTargets.length),
					e.observationTargets.forEach((function (r) {
						r.isActive() && (cs(r.target) > t ? e.activeTargets.push(r) : e.skippedTargets.push(r));
					}));
			}));
		}, fs = function () {
			var t, e = 0;
			for (us(e); Vo.some((function (t) {
				return t.activeTargets.length > 0;
			}));) e = ls(), us(e);
			return Vo.some((function (t) {
				return t.skippedTargets.length > 0;
			})) && ("function" == typeof ErrorEvent ? t = new ErrorEvent("error", {
				message: $o
			}) : ((t = document.createEvent("Event")).initEvent("error", !1, !1), t.message = $o),
				window.dispatchEvent(t)), e > 0;
		}, hs = [], ds = function (t) {
			if (!Xo) {
				var e = 0, r = document.createTextNode("");
				new MutationObserver((function () {
					return hs.splice(0).forEach((function (t) {
						return t();
					}));
				})).observe(r, {
					characterData: !0
				}), Xo = function () {
					r.textContent = "" + (e ? e-- : e++);
				};
			}
			hs.push(t), Xo();
		}, ps = 0, vs = {
			attributes: !0,
			characterData: !0,
			childList: !0,
			subtree: !0
		}, gs = ["resize", "load", "transitionend", "animationend", "animationstart", "animationiteration", "keyup", "keydown", "mouseup", "mousedown", "mouseover", "mouseout", "blur", "focus"], bs = function (t) {
			return void 0 === t && (t = 0), Date.now() + t;
		}, ys = !1, ms = new (function () {
			function t() {
				var t = this;
				this.stopped = !0, this.listener = function () {
					return t.schedule();
				};
			}
			return t.prototype.run = function (t) {
				var e = this;
				if (void 0 === t && (t = 250), !ys) {
					ys = !0;
					var r, n = bs(t);
					r = function () {
						var r = !1;
						try {
							r = fs();
						} finally {
							if (ys = !1, t = n - bs(), !ps) return;
							r ? e.run(1e3) : t > 0 ? e.run(t) : e.start();
						}
					}, ds((function () {
						requestAnimationFrame(r);
					}));
				}
			}, t.prototype.schedule = function () {
				this.stop(), this.run();
			}, t.prototype.observe = function () {
				var t = this, e = function () {
					return t.observer && t.observer.observe(document.body, vs);
				};
				document.body ? e() : Jo.addEventListener("DOMContentLoaded", e);
			}, t.prototype.start = function () {
				var t = this;
				this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener),
					this.observe(), gs.forEach((function (e) {
						return Jo.addEventListener(e, t.listener, !0);
					})));
			}, t.prototype.stop = function () {
				var t = this;
				this.stopped || (this.observer && this.observer.disconnect(), gs.forEach((function (e) {
					return Jo.removeEventListener(e, t.listener, !0);
				})), this.stopped = !0);
			}, t;
		}()), xs = function (t) {
			!ps && t > 0 && ms.start(), !(ps += t) && ms.stop();
		}, Es = function () {
			function t(t, e) {
				this.target = t, this.observedBox = e || Do.CONTENT_BOX, this.lastReportedSize = {
					inlineSize: 0,
					blockSize: 0
				};
			}
			return t.prototype.isActive = function () {
				var t, e = ss(this.target, this.observedBox, !0);
				return t = this.target, Go(t) || function (t) {
					switch (t.tagName) {
						case "INPUT":
							if ("image" !== t.type) break;

						case "VIDEO":
						case "AUDIO":
						case "EMBED":
						case "OBJECT":
						case "CANVAS":
						case "IFRAME":
						case "IMG":
							return !0;
					}
					return !1;
				}(t) || "inline" !== getComputedStyle(t).display || (this.lastReportedSize = e),
					this.lastReportedSize.inlineSize !== e.inlineSize || this.lastReportedSize.blockSize !== e.blockSize;
			}, t;
		}(), ws = function (t, e) {
			this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [],
				this.observer = t, this.callback = e;
		}, Os = new WeakMap, Ss = function (t, e) {
			for (var r = 0; r < t.length; r += 1) if (t[r].target === e) return r;
			return -1;
		}, As = function () {
			function t() { }
			return t.connect = function (t, e) {
				var r = new ws(t, e);
				Os.set(t, r);
			}, t.observe = function (t, e, r) {
				var n = Os.get(t), i = 0 === n.observationTargets.length;
				Ss(n.observationTargets, e) < 0 && (i && Vo.push(n), n.observationTargets.push(new Es(e, r && r.box)),
					xs(1), ms.schedule());
			}, t.unobserve = function (t, e) {
				var r = Os.get(t), n = Ss(r.observationTargets, e), i = 1 === r.observationTargets.length;
				n >= 0 && (i && Vo.splice(Vo.indexOf(r), 1), r.observationTargets.splice(n, 1),
					xs(-1));
			}, t.disconnect = function (t) {
				var e = this, r = Os.get(t);
				r.observationTargets.slice().forEach((function (r) {
					return e.unobserve(t, r.target);
				})), r.activeTargets.splice(0, r.activeTargets.length);
			}, t;
		}(), ks = function () {
			function t(t) {
				if (0 === arguments.length) throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
				if ("function" != typeof t) throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
				As.connect(this, t);
			}
			return t.prototype.observe = function (t, e) {
				if (0 === arguments.length) throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
				if (!Ko(t)) throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
				As.observe(this, t, e);
			}, t.prototype.unobserve = function (t) {
				if (0 === arguments.length) throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
				if (!Ko(t)) throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
				As.unobserve(this, t);
			}, t.prototype.disconnect = function () {
				As.disconnect(this);
			}, t.toString = function () {
				return "function ResizeObserver () { [polyfill code] }";
			}, t;
		}(), Ts = o.TypeError, Ls = function (t) {
			return function (e, r, n, i) {
				lt(r);
				var o = x(e), s = ce(o), a = ve(o), c = t ? a - 1 : 0, l = t ? -1 : 1;
				if (n < 2) for (; ;) {
					if (c in s) {
						i = s[c], c += l;
						break;
					}
					if (c += l, t ? c < 0 : a <= c) throw Ts("Reduce of empty array with no initial value");
				}
				for (; t ? c >= 0 : a > c; c += l) c in s && (i = r(i, s[c], c, o));
				return i;
			};
		}, Rs = {
			left: Ls(!1),
			right: Ls(!0)
		}, _s = "process" == Gt(o.process), js = Rs.left, zs = ze("reduce");
		hr({
			target: "Array",
			proto: !0,
			forced: !zs || !_s && N > 79 && N < 83
		}, {
			reduce: function (t) {
				var e = arguments.length;
				return js(this, t, e, e > 1 ? arguments[1] : void 0);
			}
		});
		var Ms, Cs, Ns = function () {
			var t = tt(this), e = "";
			return t.hasIndices && (e += "d"), t.global && (e += "g"), t.ignoreCase && (e += "i"),
				t.multiline && (e += "m"), t.dotAll && (e += "s"), t.unicode && (e += "u"), t.sticky && (e += "y"),
				e;
		}, Ws = o.RegExp, Is = u((function () {
			var t = Ws("a", "y");
			return t.lastIndex = 2, null != t.exec("abcd");
		})), Ps = Is || u((function () {
			return !Ws("a", "y").sticky;
		})), Bs = {
			BROKEN_CARET: Is || u((function () {
				var t = Ws("^r", "gy");
				return t.lastIndex = 2, null != t.exec("str");
			})),
			MISSED_STICKY: Ps,
			UNSUPPORTED_Y: Is
		}, Ds = o.RegExp, Fs = u((function () {
			var t = Ds(".", "s");
			return !(t.dotAll && t.exec("\n") && "s" === t.flags);
		})), Vs = o.RegExp, $s = u((function () {
			var t = Vs("(?<a>b)", "g");
			return "b" !== t.exec("b").groups.a || "bc" !== "b".replace(t, "$<a>c");
		})), Xs = $t.get, Hs = l("native-string-replace", String.prototype.replace), qs = RegExp.prototype.exec, Ys = qs, Gs = g("".charAt), Us = g("".indexOf), Ks = g("".replace), Js = g("".slice), Qs = (Cs = /b*/g,
			rt(qs, Ms = /a/, "a"), rt(qs, Cs, "a"), 0 !== Ms.lastIndex || 0 !== Cs.lastIndex), Zs = Bs.BROKEN_CARET, ta = void 0 !== /()??/.exec("")[1];
		(Qs || ta || Zs || Fs || $s) && (Ys = function (t) {
			var e, r, n, i, o, s, a, c = this, l = Xs(c), u = pr(t), f = l.raw;
			if (f) return f.lastIndex = c.lastIndex, e = rt(Ys, f, u), c.lastIndex = f.lastIndex,
				e;
			var h = l.groups, d = Zs && c.sticky, p = rt(Ns, c), v = c.source, g = 0, b = u;
			if (d && (p = Ks(p, "y", ""), -1 === Us(p, "g") && (p += "g"), b = Js(u, c.lastIndex),
				c.lastIndex > 0 && (!c.multiline || c.multiline && "\n" !== Gs(u, c.lastIndex - 1)) && (v = "(?: " + v + ")",
					b = " " + b, g++), r = new RegExp("^(?:" + v + ")", p)), ta && (r = new RegExp("^" + v + "$(?!\\s)", p)),
				Qs && (n = c.lastIndex), i = rt(qs, d ? r : c, b), d ? i ? (i.input = Js(i.input, g),
					i[0] = Js(i[0], g), i.index = c.lastIndex, c.lastIndex += i[0].length) : c.lastIndex = 0 : Qs && i && (c.lastIndex = c.global ? i.index + i[0].length : n),
				ta && i && i.length > 1 && rt(Hs, i[0], r, (function () {
					for (o = 1; o < arguments.length - 2; o++) void 0 === arguments[o] && (i[o] = void 0);
				})), i && h) for (i.groups = s = Hr(null), o = 0; o < h.length; o++) s[(a = h[o])[0]] = i[a[1]];
			return i;
		});
		var ea = Ys;
		hr({
			target: "RegExp",
			proto: !0,
			forced: /./.exec !== ea
		}, {
			exec: ea
		});
		var ra = V("species"), na = RegExp.prototype, ia = function (t, e, r, n) {
			var i = V(t), o = !u((function () {
				var e = {};
				return e[i] = function () {
					return 7;
				}, 7 != ""[t](e);
			})), s = o && !u((function () {
				var e = !1, r = /a/;
				return "split" === t && ((r = {}).constructor = {}, r.constructor[ra] = function () {
					return r;
				}, r.flags = "", r[i] = /./[i]), r.exec = function () {
					return e = !0, null;
				}, r[i](""), !e;
			}));
			if (!o || !s || r) {
				var a = g(/./[i]), c = e(i, ""[t], (function (t, e, r, n, i) {
					var s = g(t), c = e.exec;
					return c === ea || c === na.exec ? o && !i ? {
						done: !0,
						value: a(e, r, n)
					} : {
						done: !0,
						value: s(r, e, n)
					} : {
						done: !1
					};
				}));
				Ht(String.prototype, t, c[0]), Ht(na, i, c[1]);
			}
			n && Et(na[i], "sham", !0);
		}, oa = Mn.charAt, sa = function (t, e, r) {
			return e + (r ? oa(t, e).length : 1);
		}, aa = o.TypeError, ca = function (t, e) {
			var r = t.exec;
			if (T(r)) {
				var n = rt(r, t, e);
				return null !== n && tt(n), n;
			}
			if ("RegExp" === Gt(t)) return rt(ea, t, e);
			throw aa("RegExp#exec called on incompatible receiver");
		};
		ia("match", (function (t, e, r) {
			return [function (e) {
				var r = y(this), n = null == e ? void 0 : ut(e, t);
				return n ? rt(n, e, r) : new RegExp(e)[t](pr(r));
			}, function (t) {
				var n = tt(this), i = pr(t), o = r(e, n, i);
				if (o.done) return o.value;
				if (!n.global) return ca(n, i);
				var s = n.unicode;
				n.lastIndex = 0;
				for (var a, c = [], l = 0; null !== (a = ca(n, i));) {
					var u = pr(a[0]);
					c[l] = u, "" === u && (n.lastIndex = sa(i, pe(n.lastIndex), s)), l++;
				}
				return 0 === l ? null : c;
			}];
		}));
		var la = At.EXISTS, ua = mt.f, fa = Function.prototype, ha = g(fa.toString), da = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/, pa = g(da.exec);
		H && !la && ua(fa, "name", {
			configurable: !0,
			get: function () {
				try {
					return pa(da, ha(this))[1];
				} catch (t) {
					return "";
				}
			}
		});
		var va = Function.prototype, ga = va.apply, ba = va.call, ya = "object" == typeof Reflect && Reflect.apply || (f ? ba.bind(ga) : function () {
			return ba.apply(ga, arguments);
		}), ma = Math.floor, xa = g("".charAt), Ea = g("".replace), wa = g("".slice), Oa = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, Sa = /\$([$&'`]|\d{1,2})/g, Aa = function (t, e, r, n, i, o) {
			var s = r + t.length, a = n.length, c = Sa;
			return void 0 !== i && (i = x(i), c = Oa), Ea(o, c, (function (o, c) {
				var l;
				switch (xa(c, 0)) {
					case "$":
						return "$";

					case "&":
						return t;

					case "`":
						return wa(e, 0, r);

					case "'":
						return wa(e, s);

					case "<":
						l = i[wa(c, 1, -1)];
						break;

					default:
						var u = +c;
						if (0 === u) return o;
						if (u > a) {
							var f = ma(u / 10);
							return 0 === f ? o : f <= a ? void 0 === n[f - 1] ? xa(c, 1) : n[f - 1] + xa(c, 1) : o;
						}
						l = n[u - 1];
				}
				return void 0 === l ? "" : l;
			}));
		}, ka = V("replace"), Ta = Math.max, La = Math.min, Ra = g([].concat), _a = g([].push), ja = g("".indexOf), za = g("".slice), Ma = "$0" === "a".replace(/./, "$0"), Ca = !!/./[ka] && "" === /./[ka]("a", "$0");
		ia("replace", (function (t, e, r) {
			var n = Ca ? "$" : "$0";
			return [function (t, r) {
				var n = y(this), i = null == t ? void 0 : ut(t, ka);
				return i ? rt(i, t, n, r) : rt(e, pr(n), t, r);
			}, function (t, i) {
				var o = tt(this), s = pr(t);
				if ("string" == typeof i && -1 === ja(i, n) && -1 === ja(i, "$<")) {
					var a = r(e, o, s, i);
					if (a.done) return a.value;
				}
				var c = T(i);
				c || (i = pr(i));
				var l = o.global;
				if (l) {
					var u = o.unicode;
					o.lastIndex = 0;
				}
				for (var f = []; ;) {
					var h = ca(o, s);
					if (null === h) break;
					if (_a(f, h), !l) break;
					"" === pr(h[0]) && (o.lastIndex = sa(s, pe(o.lastIndex), u));
				}
				for (var d, p = "", v = 0, g = 0; g < f.length; g++) {
					for (var b = pr((h = f[g])[0]), y = Ta(La(he(h.index), s.length), 0), m = [], x = 1; x < h.length; x++) _a(m, void 0 === (d = h[x]) ? d : String(d));
					var E = h.groups;
					if (c) {
						var w = Ra([b], m, y, s);
						void 0 !== E && _a(w, E);
						var O = pr(ya(i, void 0, w));
					} else O = Aa(b, s, y, m, E, i);
					y >= v && (p += za(s, v, y) + O, v = y + b.length);
				}
				return p + za(s, v);
			}];
		}), !!u((function () {
			var t = /./;
			return t.exec = function () {
				var t = [];
				return t.groups = {
					a: "7"
				}, t;
			}, "7" !== "".replace(t, "$<a>");
		})) || !Ma || Ca);
		var Na = function (t) {
			return Array.prototype.reduce.call(t, (function (t, e) {
				var r = e.name.match(/data-simplebar-(.+)/);
				if (r) {
					var n = r[1].replace(/\W+(.)/g, (function (t, e) {
						return e.toUpperCase();
					}));
					switch (e.value) {
						case "true":
							t[n] = !0;
							break;

						case "false":
							t[n] = !1;
							break;

						case void 0:
							t[n] = !0;
							break;

						default:
							t[n] = e.value;
					}
				}
				return t;
			}), {});
		};
		function Wa(t) {
			return t && t.ownerDocument && t.ownerDocument.defaultView ? t.ownerDocument.defaultView : window;
		}
		function Ia(t) {
			return t && t.ownerDocument ? t.ownerDocument : document;
		}
		var Pa = null, Ba = null;
		function Da(t) {
			if (null === Pa) {
				var e = Ia(t);
				if (void 0 === e) return Pa = 0;
				var r = e.body, n = e.createElement("div");
				n.classList.add("simplebar-hide-scrollbar"), r.appendChild(n);
				var i = n.getBoundingClientRect().right;
				r.removeChild(n), Pa = i;
			}
			return Pa;
		}
		Ie && window.addEventListener("resize", (function () {
			Ba !== window.devicePixelRatio && (Ba = window.devicePixelRatio, Pa = null);
		}));
		var Fa = function () {
			function t(e, r) {
				var n = this;
				this.onScroll = function () {
					var t = Wa(n.el);
					n.scrollXTicking || (t.requestAnimationFrame(n.scrollX), n.scrollXTicking = !0),
						n.scrollYTicking || (t.requestAnimationFrame(n.scrollY), n.scrollYTicking = !0);
				}, this.scrollX = function () {
					n.axis.x.isOverflowing && (n.showScrollbar("x"), n.positionScrollbar("x")), n.scrollXTicking = !1;
				}, this.scrollY = function () {
					n.axis.y.isOverflowing && (n.showScrollbar("y"), n.positionScrollbar("y")), n.scrollYTicking = !1;
				}, this.onMouseEnter = function () {
					n.showScrollbar("x"), n.showScrollbar("y");
				}, this.onMouseMove = function (t) {
					n.mouseX = t.clientX, n.mouseY = t.clientY, (n.axis.x.isOverflowing || n.axis.x.forceVisible) && n.onMouseMoveForAxis("x"),
						(n.axis.y.isOverflowing || n.axis.y.forceVisible) && n.onMouseMoveForAxis("y");
				}, this.onMouseLeave = function () {
					n.onMouseMove.cancel(), (n.axis.x.isOverflowing || n.axis.x.forceVisible) && n.onMouseLeaveForAxis("x"),
						(n.axis.y.isOverflowing || n.axis.y.forceVisible) && n.onMouseLeaveForAxis("y"),
						n.mouseX = -1, n.mouseY = -1;
				}, this.onWindowResize = function () {
					n.scrollbarWidth = n.getScrollbarWidth(), n.hideNativeScrollbar();
				}, this.hideScrollbars = function () {
					n.axis.x.track.rect = n.axis.x.track.el.getBoundingClientRect(), n.axis.y.track.rect = n.axis.y.track.el.getBoundingClientRect(),
						n.isWithinBounds(n.axis.y.track.rect) || (n.axis.y.scrollbar.el.classList.remove(n.classNames.visible),
							n.axis.y.isVisible = !1), n.isWithinBounds(n.axis.x.track.rect) || (n.axis.x.scrollbar.el.classList.remove(n.classNames.visible),
								n.axis.x.isVisible = !1);
				}, this.onPointerEvent = function (t) {
					var e, r;
					n.axis.x.track.rect = n.axis.x.track.el.getBoundingClientRect(), n.axis.y.track.rect = n.axis.y.track.el.getBoundingClientRect(),
						(n.axis.x.isOverflowing || n.axis.x.forceVisible) && (e = n.isWithinBounds(n.axis.x.track.rect)),
						(n.axis.y.isOverflowing || n.axis.y.forceVisible) && (r = n.isWithinBounds(n.axis.y.track.rect)),
						(e || r) && (t.preventDefault(), t.stopPropagation(), "mousedown" === t.type && (e && (n.axis.x.scrollbar.rect = n.axis.x.scrollbar.el.getBoundingClientRect(),
							n.isWithinBounds(n.axis.x.scrollbar.rect) ? n.onDragStart(t, "x") : n.onTrackClick(t, "x")),
							r && (n.axis.y.scrollbar.rect = n.axis.y.scrollbar.el.getBoundingClientRect(), n.isWithinBounds(n.axis.y.scrollbar.rect) ? n.onDragStart(t, "y") : n.onTrackClick(t, "y"))));
				}, this.drag = function (e) {
					var r = n.axis[n.draggedAxis].track, i = r.rect[n.axis[n.draggedAxis].sizeAttr], o = n.axis[n.draggedAxis].scrollbar, s = n.contentWrapperEl[n.axis[n.draggedAxis].scrollSizeAttr], a = parseInt(n.elStyles[n.axis[n.draggedAxis].sizeAttr], 10);
					e.preventDefault(), e.stopPropagation();
					var c = (("y" === n.draggedAxis ? e.pageY : e.pageX) - r.rect[n.axis[n.draggedAxis].offsetAttr] - n.axis[n.draggedAxis].dragOffset) / (i - o.size) * (s - a);
					"x" === n.draggedAxis && (c = n.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c - (i + o.size) : c,
						c = n.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -c : c), n.contentWrapperEl[n.axis[n.draggedAxis].scrollOffsetAttr] = c;
				}, this.onEndDrag = function (t) {
					var e = Ia(n.el), r = Wa(n.el);
					t.preventDefault(), t.stopPropagation(), n.el.classList.remove(n.classNames.dragging),
						e.removeEventListener("mousemove", n.drag, !0), e.removeEventListener("mouseup", n.onEndDrag, !0),
						n.removePreventClickId = r.setTimeout((function () {
							e.removeEventListener("click", n.preventClick, !0), e.removeEventListener("dblclick", n.preventClick, !0),
								n.removePreventClickId = null;
						}));
				}, this.preventClick = function (t) {
					t.preventDefault(), t.stopPropagation();
				}, this.el = e, this.minScrollbarWidth = 20, this.options = Object.assign({}, t.defaultOptions, r),
					this.classNames = Object.assign({}, t.defaultOptions.classNames, this.options.classNames),
					this.axis = {
						x: {
							scrollOffsetAttr: "scrollLeft",
							sizeAttr: "width",
							scrollSizeAttr: "scrollWidth",
							offsetSizeAttr: "offsetWidth",
							offsetAttr: "left",
							overflowAttr: "overflowX",
							dragOffset: 0,
							isOverflowing: !0,
							isVisible: !1,
							forceVisible: !1,
							track: {},
							scrollbar: {}
						},
						y: {
							scrollOffsetAttr: "scrollTop",
							sizeAttr: "height",
							scrollSizeAttr: "scrollHeight",
							offsetSizeAttr: "offsetHeight",
							offsetAttr: "top",
							overflowAttr: "overflowY",
							dragOffset: 0,
							isOverflowing: !0,
							isVisible: !1,
							forceVisible: !1,
							track: {},
							scrollbar: {}
						}
					}, this.removePreventClickId = null, t.instances.has(this.el) || (this.recalculate = Qi(this.recalculate.bind(this), 64),
						this.onMouseMove = Qi(this.onMouseMove.bind(this), 64), this.hideScrollbars = po(this.hideScrollbars.bind(this), this.options.timeout),
						this.onWindowResize = po(this.onWindowResize.bind(this), 64, {
							leading: !0
						}), t.getRtlHelpers = Fo(t.getRtlHelpers), this.init());
			}
			t.getRtlHelpers = function () {
				var e = document.createElement("div");
				e.innerHTML = '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
				var r = e.firstElementChild;
				document.body.appendChild(r);
				var n = r.firstElementChild;
				r.scrollLeft = 0;
				var i = t.getOffset(r), o = t.getOffset(n);
				r.scrollLeft = 999;
				var s = t.getOffset(n);
				return {
					isRtlScrollingInverted: i.left !== o.left && o.left - s.left != 0,
					isRtlScrollbarInverted: i.left !== o.left
				};
			}, t.getOffset = function (t) {
				var e = t.getBoundingClientRect(), r = Ia(t), n = Wa(t);
				return {
					top: e.top + (n.pageYOffset || r.documentElement.scrollTop),
					left: e.left + (n.pageXOffset || r.documentElement.scrollLeft)
				};
			};
			var e = t.prototype;
			return e.init = function () {
				t.instances.set(this.el, this), Ie && (this.initDOM(), this.setAccessibilityAttributes(),
					this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners());
			}, e.initDOM = function () {
				var t = this;
				if (Array.prototype.filter.call(this.el.children, (function (e) {
					return e.classList.contains(t.classNames.wrapper);
				})).length) this.wrapperEl = this.el.querySelector("." + this.classNames.wrapper),
					this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector("." + this.classNames.contentWrapper),
					this.contentEl = this.options.contentNode || this.el.querySelector("." + this.classNames.contentEl),
					this.offsetEl = this.el.querySelector("." + this.classNames.offset), this.maskEl = this.el.querySelector("." + this.classNames.mask),
					this.placeholderEl = this.findChild(this.wrapperEl, "." + this.classNames.placeholder),
					this.heightAutoObserverWrapperEl = this.el.querySelector("." + this.classNames.heightAutoObserverWrapperEl),
					this.heightAutoObserverEl = this.el.querySelector("." + this.classNames.heightAutoObserverEl),
					this.axis.x.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.horizontal),
					this.axis.y.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.vertical); else {
					for (this.wrapperEl = document.createElement("div"), this.contentWrapperEl = document.createElement("div"),
						this.offsetEl = document.createElement("div"), this.maskEl = document.createElement("div"),
						this.contentEl = document.createElement("div"), this.placeholderEl = document.createElement("div"),
						this.heightAutoObserverWrapperEl = document.createElement("div"), this.heightAutoObserverEl = document.createElement("div"),
						this.wrapperEl.classList.add(this.classNames.wrapper), this.contentWrapperEl.classList.add(this.classNames.contentWrapper),
						this.offsetEl.classList.add(this.classNames.offset), this.maskEl.classList.add(this.classNames.mask),
						this.contentEl.classList.add(this.classNames.contentEl), this.placeholderEl.classList.add(this.classNames.placeholder),
						this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl),
						this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl); this.el.firstChild;) this.contentEl.appendChild(this.el.firstChild);
					this.contentWrapperEl.appendChild(this.contentEl), this.offsetEl.appendChild(this.contentWrapperEl),
						this.maskEl.appendChild(this.offsetEl), this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl),
						this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl), this.wrapperEl.appendChild(this.maskEl),
						this.wrapperEl.appendChild(this.placeholderEl), this.el.appendChild(this.wrapperEl);
				}
				if (!this.axis.x.track.el || !this.axis.y.track.el) {
					var e = document.createElement("div"), r = document.createElement("div");
					e.classList.add(this.classNames.track), r.classList.add(this.classNames.scrollbar),
						e.appendChild(r), this.axis.x.track.el = e.cloneNode(!0), this.axis.x.track.el.classList.add(this.classNames.horizontal),
						this.axis.y.track.el = e.cloneNode(!0), this.axis.y.track.el.classList.add(this.classNames.vertical),
						this.el.appendChild(this.axis.x.track.el), this.el.appendChild(this.axis.y.track.el);
				}
				this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector("." + this.classNames.scrollbar),
					this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector("." + this.classNames.scrollbar),
					this.options.autoHide || (this.axis.x.scrollbar.el.classList.add(this.classNames.visible),
						this.axis.y.scrollbar.el.classList.add(this.classNames.visible)), this.el.setAttribute("data-simplebar", "init");
			}, e.setAccessibilityAttributes = function () {
				var t = this.options.ariaLabel || "scrollable content";
				this.contentWrapperEl.setAttribute("tabindex", "0"), this.contentWrapperEl.setAttribute("role", "region"),
					this.contentWrapperEl.setAttribute("aria-label", t);
			}, e.initListeners = function () {
				var t = this, e = Wa(this.el);
				this.options.autoHide && this.el.addEventListener("mouseenter", this.onMouseEnter),
					["mousedown", "click", "dblclick"].forEach((function (e) {
						t.el.addEventListener(e, t.onPointerEvent, !0);
					})), ["touchstart", "touchend", "touchmove"].forEach((function (e) {
						t.el.addEventListener(e, t.onPointerEvent, {
							capture: !0,
							passive: !0
						});
					})), this.el.addEventListener("mousemove", this.onMouseMove), this.el.addEventListener("mouseleave", this.onMouseLeave),
					this.contentWrapperEl.addEventListener("scroll", this.onScroll), e.addEventListener("resize", this.onWindowResize);
				var r = !1, n = null, i = e.ResizeObserver || ks;
				this.resizeObserver = new i((function () {
					r && null === n && (n = e.requestAnimationFrame((function () {
						t.recalculate(), n = null;
					})));
				})), this.resizeObserver.observe(this.el), this.resizeObserver.observe(this.contentEl),
					e.requestAnimationFrame((function () {
						r = !0;
					})), this.mutationObserver = new e.MutationObserver(this.recalculate), this.mutationObserver.observe(this.contentEl, {
						childList: !0,
						subtree: !0,
						characterData: !0
					});
			}, e.recalculate = function () {
				var t = Wa(this.el);
				this.elStyles = t.getComputedStyle(this.el), this.isRtl = "rtl" === this.elStyles.direction;
				var e = this.heightAutoObserverEl.offsetHeight <= 1, r = this.heightAutoObserverEl.offsetWidth <= 1, n = this.contentEl.offsetWidth, i = this.contentWrapperEl.offsetWidth, o = this.elStyles.overflowX, s = this.elStyles.overflowY;
				this.contentEl.style.padding = this.elStyles.paddingTop + " " + this.elStyles.paddingRight + " " + this.elStyles.paddingBottom + " " + this.elStyles.paddingLeft,
					this.wrapperEl.style.margin = "-" + this.elStyles.paddingTop + " -" + this.elStyles.paddingRight + " -" + this.elStyles.paddingBottom + " -" + this.elStyles.paddingLeft;
				var a = this.contentEl.scrollHeight, c = this.contentEl.scrollWidth;
				this.contentWrapperEl.style.height = e ? "auto" : "100%", this.placeholderEl.style.width = r ? n + "px" : "auto",
					this.placeholderEl.style.height = a + "px";
				var l = this.contentWrapperEl.offsetHeight;
				this.axis.x.isOverflowing = c > n, this.axis.y.isOverflowing = a > l, this.axis.x.isOverflowing = "hidden" !== o && this.axis.x.isOverflowing,
					this.axis.y.isOverflowing = "hidden" !== s && this.axis.y.isOverflowing, this.axis.x.forceVisible = "x" === this.options.forceVisible || !0 === this.options.forceVisible,
					this.axis.y.forceVisible = "y" === this.options.forceVisible || !0 === this.options.forceVisible,
					this.hideNativeScrollbar();
				var u = this.axis.x.isOverflowing ? this.scrollbarWidth : 0, f = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
				this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > i - f, this.axis.y.isOverflowing = this.axis.y.isOverflowing && a > l - u,
					this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"),
					this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + "px", this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + "px",
					this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"),
					this.toggleTrackVisibility("y");
			}, e.getScrollbarSize = function (t) {
				if (void 0 === t && (t = "y"), !this.axis[t].isOverflowing) return 0;
				var e, r = this.contentEl[this.axis[t].scrollSizeAttr], n = this.axis[t].track.el[this.axis[t].offsetSizeAttr], i = n / r;
				return e = Math.max(~~(i * n), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (e = Math.min(e, this.options.scrollbarMaxSize)),
					e;
			}, e.positionScrollbar = function (e) {
				if (void 0 === e && (e = "y"), this.axis[e].isOverflowing) {
					var r = this.contentWrapperEl[this.axis[e].scrollSizeAttr], n = this.axis[e].track.el[this.axis[e].offsetSizeAttr], i = parseInt(this.elStyles[this.axis[e].sizeAttr], 10), o = this.axis[e].scrollbar, s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr], a = (s = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -s : s) / (r - i), c = ~~((n - o.size) * a);
					c = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c + (n - o.size) : c,
						o.el.style.transform = "x" === e ? "translate3d(" + c + "px, 0, 0)" : "translate3d(0, " + c + "px, 0)";
				}
			}, e.toggleTrackVisibility = function (t) {
				void 0 === t && (t = "y");
				var e = this.axis[t].track.el, r = this.axis[t].scrollbar.el;
				this.axis[t].isOverflowing || this.axis[t].forceVisible ? (e.style.visibility = "visible",
					this.contentWrapperEl.style[this.axis[t].overflowAttr] = "scroll") : (e.style.visibility = "hidden",
						this.contentWrapperEl.style[this.axis[t].overflowAttr] = "hidden"), this.axis[t].isOverflowing ? r.style.display = "block" : r.style.display = "none";
			}, e.hideNativeScrollbar = function () {
				this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-" + this.scrollbarWidth + "px" : 0,
					this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-" + this.scrollbarWidth + "px" : 0;
			}, e.onMouseMoveForAxis = function (t) {
				void 0 === t && (t = "y"), this.axis[t].track.rect = this.axis[t].track.el.getBoundingClientRect(),
					this.axis[t].scrollbar.rect = this.axis[t].scrollbar.el.getBoundingClientRect(),
					this.isWithinBounds(this.axis[t].scrollbar.rect) ? this.axis[t].scrollbar.el.classList.add(this.classNames.hover) : this.axis[t].scrollbar.el.classList.remove(this.classNames.hover),
					this.isWithinBounds(this.axis[t].track.rect) ? (this.showScrollbar(t), this.axis[t].track.el.classList.add(this.classNames.hover)) : this.axis[t].track.el.classList.remove(this.classNames.hover);
			}, e.onMouseLeaveForAxis = function (t) {
				void 0 === t && (t = "y"), this.axis[t].track.el.classList.remove(this.classNames.hover),
					this.axis[t].scrollbar.el.classList.remove(this.classNames.hover);
			}, e.showScrollbar = function (t) {
				void 0 === t && (t = "y");
				var e = this.axis[t].scrollbar.el;
				this.axis[t].isVisible || (e.classList.add(this.classNames.visible), this.axis[t].isVisible = !0),
					this.options.autoHide && this.hideScrollbars();
			}, e.onDragStart = function (t, e) {
				void 0 === e && (e = "y");
				var r = Ia(this.el), n = Wa(this.el), i = this.axis[e].scrollbar, o = "y" === e ? t.pageY : t.pageX;
				this.axis[e].dragOffset = o - i.rect[this.axis[e].offsetAttr], this.draggedAxis = e,
					this.el.classList.add(this.classNames.dragging), r.addEventListener("mousemove", this.drag, !0),
					r.addEventListener("mouseup", this.onEndDrag, !0), null === this.removePreventClickId ? (r.addEventListener("click", this.preventClick, !0),
						r.addEventListener("dblclick", this.preventClick, !0)) : (n.clearTimeout(this.removePreventClickId),
							this.removePreventClickId = null);
			}, e.onTrackClick = function (t, e) {
				var r = this;
				if (void 0 === e && (e = "y"), this.options.clickOnTrack) {
					var n = Wa(this.el);
					this.axis[e].scrollbar.rect = this.axis[e].scrollbar.el.getBoundingClientRect();
					var i = this.axis[e].scrollbar.rect[this.axis[e].offsetAttr], o = parseInt(this.elStyles[this.axis[e].sizeAttr], 10), s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr], a = ("y" === e ? this.mouseY - i : this.mouseX - i) < 0 ? -1 : 1, c = -1 === a ? s - o : s + o;
					!function t() {
						var i, o;
						-1 === a ? s > c && (s -= r.options.clickOnTrackSpeed, r.contentWrapperEl.scrollTo(((i = {})[r.axis[e].offsetAttr] = s,
							i)), n.requestAnimationFrame(t)) : s < c && (s += r.options.clickOnTrackSpeed, r.contentWrapperEl.scrollTo(((o = {})[r.axis[e].offsetAttr] = s,
								o)), n.requestAnimationFrame(t));
					}();
				}
			}, e.getContentElement = function () {
				return this.contentEl;
			}, e.getScrollElement = function () {
				return this.contentWrapperEl;
			}, e.getScrollbarWidth = function () {
				try {
					return "none" === getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : Da(this.el);
				} catch (t) {
					return Da(this.el);
				}
			}, e.removeListeners = function () {
				var t = this, e = Wa(this.el);
				this.options.autoHide && this.el.removeEventListener("mouseenter", this.onMouseEnter),
					["mousedown", "click", "dblclick"].forEach((function (e) {
						t.el.removeEventListener(e, t.onPointerEvent, !0);
					})), ["touchstart", "touchend", "touchmove"].forEach((function (e) {
						t.el.removeEventListener(e, t.onPointerEvent, {
							capture: !0,
							passive: !0
						});
					})), this.el.removeEventListener("mousemove", this.onMouseMove), this.el.removeEventListener("mouseleave", this.onMouseLeave),
					this.contentWrapperEl && this.contentWrapperEl.removeEventListener("scroll", this.onScroll),
					e.removeEventListener("resize", this.onWindowResize), this.mutationObserver && this.mutationObserver.disconnect(),
					this.resizeObserver && this.resizeObserver.disconnect(), this.recalculate.cancel(),
					this.onMouseMove.cancel(), this.hideScrollbars.cancel(), this.onWindowResize.cancel();
			}, e.unMount = function () {
				this.removeListeners(), t.instances.delete(this.el);
			}, e.isWithinBounds = function (t) {
				return this.mouseX >= t.left && this.mouseX <= t.left + t.width && this.mouseY >= t.top && this.mouseY <= t.top + t.height;
			}, e.findChild = function (t, e) {
				var r = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector;
				return Array.prototype.filter.call(t.children, (function (t) {
					return r.call(t, e);
				}))[0];
			}, t;
		}();
		return Fa.defaultOptions = {
			autoHide: !0,
			forceVisible: !1,
			clickOnTrack: !0,
			clickOnTrackSpeed: 40,
			classNames: {
				contentEl: "simplebar-content",
				contentWrapper: "simplebar-content-wrapper",
				offset: "simplebar-offset",
				mask: "simplebar-mask",
				wrapper: "simplebar-wrapper",
				placeholder: "simplebar-placeholder",
				scrollbar: "simplebar-scrollbar",
				track: "simplebar-track",
				heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
				heightAutoObserverEl: "simplebar-height-auto-observer",
				visible: "simplebar-visible",
				horizontal: "simplebar-horizontal",
				vertical: "simplebar-vertical",
				hover: "simplebar-hover",
				dragging: "simplebar-dragging"
			},
			scrollbarMinSize: 25,
			scrollbarMaxSize: 0,
			timeout: 1e3
		}, Fa.instances = new WeakMap, Fa.initDOMLoadedElements = function () {
			document.removeEventListener("DOMContentLoaded", this.initDOMLoadedElements), window.removeEventListener("load", this.initDOMLoadedElements),
				Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"), (function (t) {
					"init" === t.getAttribute("data-simplebar") || Fa.instances.has(t) || new Fa(t, Na(t.attributes));
				}));
		}, Fa.removeObserver = function () {
			this.globalObserver.disconnect();
		}, Fa.initHtmlApi = function () {
			this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this), "undefined" != typeof MutationObserver && (this.globalObserver = new MutationObserver(Fa.handleMutations),
				this.globalObserver.observe(document, {
					childList: !0,
					subtree: !0
				})), "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(this.initDOMLoadedElements) : (document.addEventListener("DOMContentLoaded", this.initDOMLoadedElements),
					window.addEventListener("load", this.initDOMLoadedElements));
		}, Fa.handleMutations = function (t) {
			t.forEach((function (t) {
				Array.prototype.forEach.call(t.addedNodes, (function (t) {
					1 === t.nodeType && (t.hasAttribute("data-simplebar") ? !Fa.instances.has(t) && document.documentElement.contains(t) && new Fa(t, Na(t.attributes)) : Array.prototype.forEach.call(t.querySelectorAll("[data-simplebar]"), (function (t) {
						"init" !== t.getAttribute("data-simplebar") && !Fa.instances.has(t) && document.documentElement.contains(t) && new Fa(t, Na(t.attributes));
					})));
				})), Array.prototype.forEach.call(t.removedNodes, (function (t) {
					1 === t.nodeType && ("init" === t.getAttribute("data-simplebar") ? Fa.instances.has(t) && !document.documentElement.contains(t) && Fa.instances.get(t).unMount() : Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar="init"]'), (function (t) {
						Fa.instances.has(t) && !document.documentElement.contains(t) && Fa.instances.get(t).unMount();
					})));
				}));
			}));
		}, Fa.getOptions = Na, Ie && Fa.initHtmlApi(), Fa;
	}));
	const devices = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini", "i");
	let catalogList = document.querySelector(".header__catalog");
	if (catalogList) {
		let btn = document.querySelector(".catalog__btn"), list = document.querySelector(".catalog__list"), sublist = document.querySelectorAll(".catalog__list ul"), shadow = document.querySelector(".shadow");
		btn.addEventListener("click", (() => {
			btn.classList.toggle("active");
		}));
		shadow.addEventListener("click", (() => {
			shadow.classList.remove("active");
		}));
		if (devices.test(navigator.userAgent) || window.matchMedia("(max-width:1024px)").matches) {
			let items = document.querySelectorAll(".catalog__list>li");
			items.forEach((item => {
				let sublist = item.querySelector(".catalog__list ul");
				if (sublist) item.classList.add("sublist-parent");
			}));
			let parents = document.querySelectorAll(".sublist-parent");
			parents.forEach((parent => {
				let arrow = document.createElement("span"), sublist = parent.querySelector(".catalog__list ul");
				sublist.insertAdjacentElement("beforebegin", arrow);
				arrow.classList.add("catalog__arrow");
			}));
			document.querySelectorAll(".catalog__arrow").forEach((el => el.addEventListener("click", (() => {
				let sublist = el.nextElementSibling;
				if (el.classList.contains("active")) {
					el.classList.remove("active");
					sublist.classList.remove("active");
				} else {
					document.querySelectorAll(".catalog__arrow").forEach((trigger => {
						trigger.classList.remove("active");
						trigger.nextElementSibling.classList.remove("active");
					}));
					el.classList.add("active");
					sublist.classList.add("active");
				}
			}))));
		}
		if (devices.test(navigator.userAgent)) document.querySelector("body").classList.add("_touch"); else document.querySelector("body").classList.add("_pc");
		if (window.matchMedia("(max-width:1024px)").matches) {
			btn.setAttribute("data-modal", "#catalog");
			document.querySelectorAll(".catalog__arrow").forEach((el => {
				el.addEventListener("click", (() => {
					let sublist = el.nextElementSibling;
					if (sublist.style.maxHeight) document.querySelectorAll(".catalog__arrow + ul").forEach((el => el.style.maxHeight = null)); else {
						document.querySelectorAll(".catalog__arrow + ul").forEach((el => el.style.maxHeight = null));
						sublist.style.maxHeight = sublist.scrollHeight + "px";
					}
				}));
			}));
		} else {
			document.querySelector(".catalog__btn").addEventListener("click", (() => {
				if (list.classList.contains("active")) {
					list.classList.remove("active");
					sublist.forEach((sub => sub.classList.remove("active")));
					list.querySelectorAll("span").forEach((span => span.classList.remove("active")));
					shadow.classList.remove("active");
				} else {
					list.classList.toggle("active");
					shadow.classList.toggle("active");
				}
			}));
			document.addEventListener("click", (e => {
				if (btn.classList.contains("active")) if (!list.contains(e.target) && !btn.contains(e.target)) {
					list.classList.remove("active");
					sublist.forEach((el => el.classList.remove("active")));
					document.querySelectorAll(".catalog__arrow").forEach((el => el.classList.remove("active")));
					btn.classList.remove("active");
				}
			}));
		}
	}
	if (document.querySelector(".advantages")) document.querySelectorAll(".advantages__button").forEach((el => {
		el.addEventListener("click", (() => {
			el.previousElementSibling.classList.add("active");
			el.remove();
		}));
	}));
	document.querySelectorAll(".orders__item-info>button").forEach((el => {
		el.addEventListener("click", (() => {
			if (el.classList.contains("active")) el.classList.remove("active"); else {
				document.querySelectorAll(".orders__item-info>button").forEach((btn => {
					btn.classList.remove("active");
				}));
				el.classList.add("active");
			}
			let details = el.parentNode.nextElementSibling;
			if (details.style.maxHeight) document.querySelectorAll(".orders__details").forEach((el => el.style.maxHeight = null)); else {
				document.querySelectorAll(".orders__details").forEach((el => el.style.maxHeight = null));
				details.style.maxHeight = details.scrollHeight + "px";
			}
		}));
	}));
	let likeBtn = document.querySelectorAll(".like");
	if (likeBtn) likeBtn.forEach((like => {
		like.addEventListener("click", (function () {
			this.classList.toggle("active");
		}));
	}));
	let cookie = document.querySelector(".cookie");
	if (cookie) document.querySelector(".cookie__btn").addEventListener("click", (function () {
		this.parentNode.remove();
	}));
	let langs = document.querySelector(".header__language"), script_link = document.querySelectorAll(".header__language-link");
	if (langs) script_link.forEach((el => {
		el.addEventListener("click", (() => {
			langs.querySelector(".active").classList.remove("active");
			el.classList.add("active");
		}));
	}));
	let category = document.querySelector(".categories");
	if (category) {
		let categories = document.querySelectorAll(".categories__item");
		for (let i = 0; i < categories.length; i++) {
			const cat = categories[i];
			cat.classList.add("category-" + i);
		}
	}
	let slider = document.querySelectorAll(".swiper");
	if (slider) {
		new Swiper(".banner .swiper", {
			slidesPerView: 1,
			SlidesPerGroup: 1,
			spaceBetween: 20,
			loop: true,
			grabCursor: true,
			pagination: {
				el: ".banner .swiper-pagination"
			},
			navigation: {
				nextEl: ".banner .swiper-button-next",
				prevEl: ".banner .swiper-button-prev"
			},
			autoplay: {
				delay: 5e3
			}
		});
		const popularSlider = new Swiper(".popular .swiper", {
			init: false,
			grabCursor: true,
			SlidesPerGroup: 1,
			spaceBetween: 20,
			slidesPerView: 2,
			navigation: {
				nextEl: ".popular .swiper-button-next",
				prevEl: ".popular .swiper-button-prev"
			},
			breakpoints: {
				768: {
					slidesPerView: 3
				},
				1280: {
					slidesPerView: 3,
					spaceBetween: 10
				},
				1680: {
					slidesPerView: 4,
					spaceBetween: 10
				}
			}
		});
		if (document.querySelector(".popular")) {
			let popSlider = document.querySelector(".popular .swiper"), popSlides = popSlider.querySelectorAll(".swiper-slide"), popBtn = document.querySelector(".popular__buttons");
			if (window.matchMedia("(max-width:480px)").matches) {
				popSlides.length > 2 ? popularSlider.init() : false;
				if (popSlides.length <= 2) {
					popSlides.forEach((slide => {
						slide.classList.remove("swiper-slide");
						slide.classList.add("product-slide");
					}));
					popBtn.style.opacity = "0";
				}
			} else {
				popSlides.length > 3 ? popularSlider.init() : false;
				if (popSlides.length <= 3) {
					popSlides.forEach((slide => {
						slide.classList.remove("swiper-slide");
						slide.classList.add("product-slide");
					}));
					popBtn.style.opacity = "0";
				}
			}
		}
		const bestSlider = new Swiper(".best .swiper", {
			init: false,
			grabCursor: true,
			SlidesPerGroup: 1,
			spaceBetween: 20,
			slidesPerView: 2,
			navigation: {
				nextEl: ".best .swiper-button-next",
				prevEl: ".best .swiper-button-prev"
			},
			breakpoints: {
				768: {
					slidesPerView: 3
				},
				1280: {
					slidesPerView: 3,
					spaceBetween: 10
				},
				1680: {
					slidesPerView: 4,
					spaceBetween: 10
				}
			}
		});
		if (document.querySelector(".best")) {
			let bstSlider = document.querySelector(".best .swiper"), bstSlides = bstSlider.querySelectorAll(".swiper-slide"), bstBtn = document.querySelector(".best__buttons");
			if (window.matchMedia("(max-width:480px)").matches) {
				bstSlides.length > 2 ? bestSlider.init() : false;
				if (bstSlides.length <= 2) {
					bstSlides.forEach((slide => {
						slide.classList.remove("swiper-slide");
						slide.classList.add("product-slide");
					}));
					bstBtn.style.opacity = "0";
				}
			} else {
				bstSlides.length > 3 ? bestSlider.init() : false;
				if (bstSlides.length <= 3) {
					bstSlides.forEach((slide => {
						slide.classList.remove("swiper-slide");
						slide.classList.add("product-slide");
					}));
					bstBtn.style.opacity = "0";
				}
			}
		}
		new Swiper(".product__slider .swiper", {
			grabCursor: true,
			SlidesPerGroup: 1,
			spaceBetween: 20,
			slidesPerView: 2,
			navigation: {
				nextEl: ".product__slider .swiper-button-next",
				prevEl: ".product__slider .swiper-button-prev"
			},
			breakpoints: {
				768: {
					slidesPerView: 3
				},
				1280: {
					slidesPerView: 4,
					spaceBetween: 10
				},
				1680: {
					slidesPerView: 4,
					spaceBetween: 10
				}
			}
		});
		new Swiper(".partners .swiper", {
			SlidesPerGroup: 1,
			slidesPerView: 2,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				delay: 2e3
			},
			breakpoints: {
				768: {
					slidesPerView: 3
				},
				1024: {
					slidesPerView: 4
				},
				1280: {
					spaceBetween: 10,
					grabCursor: true,
					slidesPerView: 4
				},
				1680: {
					slidesPerView: 5,
					allowTouchMove: false,
					loop: false,
					watchOverflow: true
				}
			}
		});
		const thumbs = new Swiper(".product__thumb", {
			SlidesPerGroup: 1,
			slidesPerView: 5,
			spaceBetween: 10,
			scrollbar: {
				el: ".swiper-scrollbar",
				draggable: true
			},
			breakpoints: {
				480: {
					slidesPerView: 4
				},
				768: {
					slidesPerView: 5
				},
				1280: {
					slidesPerView: 6
				}
			}
		});
		new Swiper(".product__photo-main", {
			navigation: {
				nextEl: ".product__photo .swiper-button-next",
				prevEl: ".product__photo .swiper-button-prev"
			},
			thumbs: {
				swiper: thumbs
			}
		});
		new Swiper(".delivery__services", {
			slidesPerView: 3,
			spaceBetween: 20,
			autoplay: {
				delay: 2e3
			},
			breakpoints: {
				320: {
					direction: "vertical"
				},
				480: {
					direction: "horizontal"
				},
				1024: {
					spaceBetween: 10
				}
			}
		});
		const chooseTabs = new Swiper(".choose__tabs", {
			slidesPerView: 3,
			allowTouchMove: false,
			direction: "vertical",
			breakpoints: {
				768: {
					direction: "horizontal"
				}
			}
		});
		new Swiper(".choose__content", {
			autoHeight: true,
			thumbs: {
				swiper: chooseTabs
			},
			spaceBetween: 20,
			allowTouchMove: false
		});
	}
	var range = document.getElementById("slider");
	if (range) {
		noUiSlider.create(range, {
			start: [5e3, 45e3],
			connect: true,
			step: 1,
			range: {
				min: 25,
				max: 5e4
			}
		});
		const input0 = document.getElementById("by");
		const input1 = document.getElementById("for");
		const inputs = [input0, input1];
		range.noUiSlider.on("update", (function (values, handle) {
			inputs[handle].value = Math.round(values[handle]);
		}));
		const setRangeSlider = (i, value) => {
			let array = [null, null];
			array[i] = value;
			range.noUiSlider.set(array);
		};
		inputs.forEach(((el, index) => {
			el.addEventListener("change", (e => {
				setRangeSlider(index, e.currentTarget.value);
			}));
		}));
	}
	let personalData = document.querySelector(".personal");
	if (personalData) {
		let personalChange = document.querySelectorAll(".personal__change"), cancelChange = document.querySelectorAll(".personal__cancel");
		personalChange.forEach((el => {
			el.addEventListener("click", (function () {
				this.parentNode.classList.remove("active");
				this.parentNode.nextElementSibling.classList.add("active");
			}));
		}));
		cancelChange.forEach((el => {
			el.addEventListener("click", (function () {
				this.parentNode.previousElementSibling.classList.add("active");
				this.parentNode.classList.remove("active");
			}));
		}));
	}
	if (document.querySelector(".header__search")) {
		let search = document.querySelector("#search input");
		search.onfocus = function () {
			document.querySelector(".shadow").classList.add("active");
			document.querySelector("#search").classList.add("focus");
		};
		search.onblur = function () {
			document.querySelector(".shadow").classList.remove("active");
			document.querySelector("#search").classList.remove("focus");
		};
	}
	if (document.querySelector(".choose")) {
		let table = document.querySelectorAll(".choose__img img");
		table.forEach((tab => {
			tab.closest(".choose__img").style.width = tab.offsetWidth + "px";
		}));
	}
	let cartBtn = document.querySelector(".header__client-btn.cart");
	if (cartBtn) {
		let cartPop = document.querySelector(".header__cart"), closeBtn = cartPop.querySelector(".close-button");
		if (devices.test(navigator.userAgent)) {
			cartBtn.addEventListener("click", (e => {
				e.preventDefault();
				cartPop.classList.toggle("active");
			}));
			closeBtn.addEventListener("click", (() => {
				cartPop.classList.remove("active");
			}));
			document.addEventListener("click", (function (event) {
				if (!cartPop.contains(event.target) & !cartBtn.contains(event.target)) cartPop.classList.remove("active");
			}));
		} else cartBtn.classList.add("hover");
	}
	document.addEventListener("formSent", (function (e) {
		const currentForm = e.detail.form;
		currentForm.classList.add("_form-sent");
	}));
	if (document.querySelector(".catalog__list")) {
		let catalogItem = document.querySelectorAll(".catalog__list>li>a");
		catalogItem.forEach(item => {
			if (item.href.includes('znyzhky')) {
				item.closest('li').classList.add('discount');
			}
		})
	}
	window["FLS"] = false;
	tabs();
	formFieldsInit({
		viewPass: true,
		autoHeight: false
	});
	formSubmit();
	formQuantity();
})();

const myModal = new HystModal({
	linkAttributeName: "data-modal",
	catchFocus: true,
	waitTransitions: true,
	closeOnEsc: false,
	beforeOpen: function (modal) {
		if (document.querySelector(".shadow")) document.querySelector(".shadow").classList.remove("active");
	},
	afterClose: function (modal) {
		if (document.querySelector(".catalog__btn")) {
			document.querySelectorAll(".catalog__arrow + ul").forEach((el => el.style.maxHeight = null));
			document.querySelector(".catalog__btn").classList.remove("active");
			document.querySelectorAll(".catalog__arrow").forEach((el => el.classList.remove("active")));
		}
	}
});
//myModal.open("#first-buy");