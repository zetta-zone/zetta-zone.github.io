/* Mobile detail header only: preserve the existing desktop arrangement. */
(()=>{'use strict';
const mobileHeader=matchMedia('(max-width:700px)');
const close=document.querySelector('.close-card');
const description=document.querySelector('#essence');
const platforms=document.querySelector('.identity .platforms');
function arrangeMobileHeader(){
 close.classList.toggle('mobile-header-close',mobileHeader.matches);
 if(!mobileHeader.matches){header.append(metrics);return}
 // Keep the same description and statistics in both mobile reading modes.
 platforms.before(description);

 (readingHeader.hidden?header:readingBox).append(metrics);
}
const originalReadingHeader=setReadingHeader;
setReadingHeader=function(show){originalReadingHeader(show);arrangeMobileHeader()};
mobileHeader.addEventListener('change',arrangeMobileHeader);
arrangeMobileHeader();
})();
