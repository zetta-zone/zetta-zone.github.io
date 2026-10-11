		(function(){
				// Auto-load real brand logos based on the outbound link domain in each card.
				// Providers: Clearbit logo -> Google S2 favicon. Falls back to the emoji.
					  function getHost(href){
							try{
						
						
							var u = new URL(href);
							return (u.hostname || '').replace(/^www\./,'');
							}catch(e){ return ''; }
						}

						  function firstOutboundLink(card){
								// Prefer main CTA buttons
								var selectors = [
								  "a[data-track='click'][data-btn='earn']",
								  "a[data-track='click'][data-btn='claim']",
								  "a[data-track='click'][data-btn='play']",
								  "a[data-track='click'][data-btn='wallet']",
								  "a[data-track='click'][data-btn='get']",
								  "a.btn-primary",
								  "a.btn"
								];
								for (var i=0;i<selectors.length;i++){
								  var a = card.querySelector(selectors[i]);
								  if (a && a.getAttribute('href') && /^https?:/i.test(a.getAttribute('href'))) return a;
								}
								// Fallback: any outbound link
								var links = card.querySelectorAll("a[href^='http']");
								return links.length ? links[0] : null;
							}

								function setLogo(iconEl, host){
									var img = iconEl.querySelector("img.brand-logo");
									if(!img) return;
									var providers = [
										  "https://icons.duckduckgo.com/ip3/" + host + ".ico",
										  "https://www.google.com/s2/favicons?domain=" + host + "&sz=128",
										  "https://icons.google.com/favicon?domain=" + host + "&sz=128"
										];
									var idx = 0;
									img.loading = "lazy";
									img.decoding = "async";
									img.referrerPolicy = "no-referrer";

									function tryNext(){
									  if(idx >= providers.length) return;
									  img.src = providers[idx++];
									}

									img.addEventListener("load", function(){
									  // Some providers return 1x1 or empty; guard a bit
									  if (img.naturalWidth && img.naturalWidth >= 16) {
										iconEl.classList.add("has-logo");
									  } else {
										tryNext();
									  }
									}, {once:false});

									img.addEventListener("error", function(){
									  tryNext();
									}, {once:false});

									tryNext();
								}

													// Найдите эту строку в вашем коде авто-логотипов:
								document.addEventListener("DOMContentLoaded", function(){
									// Превратите анонимную функцию в именованную:
									window.initAutoLogos = function() {
										var icons = document.querySelectorAll(".ecard-icon");
										icons.forEach(function(icon){
											var card = icon.closest(".ecard");
											if(!card) return;
											var a = firstOutboundLink(card);
											if(!a) return;
											var host = getHost(a.getAttribute("href"));
											if(!host) return;
											setLogo(icon, host);
										});
									};
									
									// И сразу запустите её для статичных карточек:
									window.initAutoLogos();
								});

})();