import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">kent blog.</p>
          <p className="footer-note">大型犬と、働く父の暮らし。</p>
        </div>
        <div>
          <nav className="footer-links" aria-label="フッターナビゲーション">
            <a href="#about">ABOUT</a>
            <Link href="/studio">STUDIO</Link>
            <a href="https://instagram.com/kents_nft/" target="_blank" rel="noreferrer">INSTAGRAM</a>
          </nav>
          <p className="copyright">© {new Date().getFullYear()} kent blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
