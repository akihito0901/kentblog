const menuButton = document.querySelector('.menu-toggle');
const navShell = document.querySelector('.nav-shell');

if (menuButton && navShell) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
    navShell.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
    navShell.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  navShell.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.fade-up');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const input = form.querySelector('input');
    if (button && input.checkValidity()) {
      button.textContent = '✓';
      input.value = '';
      input.placeholder = 'デモ版のため、送信されません';
    }
  });
});

const instagramProfile = {
  handle: 'kents_nft',
  displayName: 'Kent / ケント',
  url: 'https://www.instagram.com/kents_nft/',
  posts: '637',
  followers: '3.3万人',
  following: '681人',
  updatedAt: '2026年8月時点',
};

document.querySelectorAll('.article-body').forEach((articleBody) => {
  if (articleBody.querySelector('.instagram-cta')) return;

  const instagramCta = document.createElement('aside');
  instagramCta.className = 'instagram-cta';
  instagramCta.setAttribute('aria-labelledby', 'instagram-cta-heading');
  instagramCta.innerHTML = `
    <div class="instagram-profile">
      <img class="instagram-avatar" src="assets/images/profile-kent-dog.svg" alt="Kentと大型犬のプロフィールイラスト" width="240" height="240">
      <div>
        <p class="instagram-eyebrow">Follow on Instagram</p>
        <h2 id="instagram-cta-heading">@${instagramProfile.handle}</h2>
        <p class="instagram-name">${instagramProfile.displayName}</p>
      </div>
    </div>
    <dl class="instagram-stats" aria-label="Instagramプロフィール情報">
      <div><dt>${instagramProfile.posts}</dt><dd>投稿</dd></div>
      <div><dt>${instagramProfile.followers}</dt><dd>フォロワー</dd></div>
      <div><dt>${instagramProfile.following}</dt><dd>フォロー中</dd></div>
    </dl>
    <p class="instagram-bio">ハスキーと暮らす二児のパパ。子ども、犬、田舎での暮らしや、ブログでは伝えきれない日常を発信しています。</p>
    <a class="instagram-button" href="${instagramProfile.url}" target="_blank" rel="noopener noreferrer">
      Instagramでフォローする <span aria-hidden="true">↗</span>
    </a>
    <p class="instagram-updated">※投稿数・フォロワー数は${instagramProfile.updatedAt}</p>
  `;
  articleBody.append(instagramCta);
});
