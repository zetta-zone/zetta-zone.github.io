class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
           

            <header>
                <div class="nav-inner">
                    <!-- Наше новое крутое название! -->
                    <div class="logo">ZETTA</div>
                    
                    <nav class="nav-links">
                        <a href="index.html" class="nav-link" id="nav-index">Claim & Multiply</a>
                        <a href="play-earn.html" class="nav-link" id="nav-play-earn">Play & Earn</a>
                        <a href="opportunities.html" class="nav-link" id="nav-opportunities">More Opportunities</a>
                    </nav>
                </div>
            </header>
        `;

        this.setActivePage();
    }

    setActivePage() {
        let path = window.location.pathname.split("/").pop();
        if (path === "" || path === "index.html") {
            document.getElementById('nav-index')?.classList.add('active');
        } else if (path === "play-earn.html") {
            document.getElementById('nav-play-earn')?.classList.add('active');
        } else if (path === "opportunities.html") {
            document.getElementById('nav-opportunities')?.classList.add('active');
        }
    }
}
customElements.define('main-header', SiteHeader);
