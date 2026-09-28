'use client'

import Link from 'next/link'
import {useState} from 'react'

const navItems = [
  {label: 'ホーム', icon: '⌂', href: '/'},
  {label: 'フリーランス', icon: '↗', href: '/#freelance'},
  {label: '副業', icon: '＋', href: '/#side-job'},
  {label: '犬・ハスキー', icon: '●', href: '/#dog-food'},
  {label: '犬のDIY', icon: '◇', href: '/#diy'},
  {label: '編集室', icon: '✎', href: '/studio'},
]

export function Header({siteTitle, tagline}: {siteTitle: string; tagline: string}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label={`${siteTitle} トップページ`}>
            <span className="brand-name">{siteTitle}</span>
            <span className="brand-tagline">{tagline}</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="global-nav"
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
      </header>
      <div className={`nav-shell${open ? ' is-open' : ''}`} id="global-nav">
        <nav className="container site-nav" aria-label="メインナビゲーション">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={item.label}>
                <Link href={item.href} aria-current={index === 0 ? 'page' : undefined} onClick={() => setOpen(false)}>
                  <span className="nav-icon">{item.icon}</span>{item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
