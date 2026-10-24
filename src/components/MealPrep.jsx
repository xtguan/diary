import React, { useEffect, useMemo, useRef, useState } from 'react'
import weeks from '../meal-prep'

const UI = {
  en: {
    eyebrow: 'One day, one week',
    heading: 'Clocked Out & Cooked Up',
    subtitle:
      'Budget meal prep and blood-sugar-friendly baking for people who refuse to cook on a Wednesday.',
    intro:
      'For people who want to eat well without making a decision every evening. Most of the food comes from one Walmart run, the cooking happens in one long session, and the fridge carries the rest of the week. Meals lean on protein and vegetables; the starchy sides and sweets are portioned rather than banned. The portions are planned on purpose. So is the grocery bill. Corporate slaves and wage slaves welcome.',
    houseRules:
      'House rules: Walmart groceries, one prep day, protein and vegetables first, and absolutely no cooking on Wednesday.',
    kicker: 'Sunday meal prep',
    language: 'Language',
    english: 'EN',
    chinese: '中文',
    view: 'Open the week',
    back: '← All weeks',
    empty: 'The first week is on its way.',
  },
  zh: {
    eyebrow: '一天备一周',
    heading: '下班开火',
    subtitle: '预算友好的备餐和控糖烘焙，写给周三坚决不做饭的人。',
    intro:
      '写给想吃得健康、又不想每天晚上做决定的人。大部分食材来自一次沃尔玛采购，做饭集中在一天，剩下的一周交给冰箱。每餐以蛋白质和蔬菜为主，主食和甜食按份装，而不是完全禁掉。份量是提前计划好的，菜钱也是。打工牛马，欢迎入座。',
    houseRules: '本店规矩：沃尔玛优先，一天备完，蛋白质和蔬菜先装，周三绝对不开火。',
    kicker: '周日备餐',
    language: '语言',
    english: 'EN',
    chinese: '中文',
    view: '查看这一周',
    back: '← 全部周次',
    empty: '第一周正在路上。',
  },
}

const LANG_STORAGE_KEY = 'meal-prep:lang'
const INITIAL_SLUG = readWeekFromUrl()

function readWeekFromUrl() {
  if (typeof window === 'undefined') return null
  const slug = new URLSearchParams(window.location.search).get('mealprep')
  return weeks.some((week) => week.slug === slug) ? slug : null
}

function readInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh') return stored
  const browser = (navigator.language || '').toLowerCase()
  return browser.startsWith('zh') ? 'zh' : 'en'
}

function weekText(week, lang) {
  return week.content[lang] || week.content.en
}

export default function MealPrep() {
  const [lang, setLang] = useState(readInitialLang)
  const [selectedSlug, setSelectedSlug] = useState(INITIAL_SLUG)
  const sectionRef = useRef(null)

  const ui = UI[lang]
  const selectedWeek = useMemo(
    () => weeks.find((week) => week.slug === selectedSlug) || null,
    [selectedSlug]
  )
  const selectedText = selectedWeek ? weekText(selectedWeek, lang) : null

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  useEffect(() => {
    const syncFromUrl = () => setSelectedSlug(readWeekFromUrl())
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  useEffect(() => {
    if (!INITIAL_SLUG) return
    const frame = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!selectedWeek) return
    const previousTitle = document.title
    document.title = `${weekText(selectedWeek, lang).title} | Clocked Out & Cooked Up | Xiaotang Guan`
    return () => {
      document.title = previousTitle
    }
  }, [selectedWeek, lang])

  const openWeek = (slug) => {
    setSelectedSlug(slug)
    const url = new URL(window.location.href)
    url.searchParams.set('mealprep', slug)
    url.hash = '#meal-prep'
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const closeWeek = () => {
    setSelectedSlug(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('mealprep')
    if (!url.hash) url.hash = '#meal-prep'
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const languageSwitch = (
    <div className="meal-prep-lang" role="group" aria-label={ui.language}>
      <button
        type="button"
        className={`meal-prep-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        {ui.english}
      </button>
      <button
        type="button"
        className={`meal-prep-lang-btn ${lang === 'zh' ? 'is-active' : ''}`}
        aria-pressed={lang === 'zh'}
        onClick={() => setLang('zh')}
      >
        {ui.chinese}
      </button>
    </div>
  )

  let content

  if (selectedWeek && selectedText) {
    content = (
      <article className="meal-prep-article" lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
        <div className="meal-prep-toolbar">
          <button type="button" className="meal-prep-back" onClick={closeWeek}>
            {ui.back}
          </button>
          {languageSwitch}
        </div>

        <div className="meal-prep-header">
          <p className="meal-prep-eyebrow">{selectedText.weekLabel}</p>
          <h1 className="meal-prep-title">{selectedText.title}</h1>
          <p className="meal-prep-subtitle">{selectedText.subtitle}</p>
          <dl className="meal-prep-stat-grid">
            {selectedText.stats.map((stat) => (
              <div className="meal-prep-stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {selectedWeek.thumbnail && (
          <figure className="meal-prep-hero">
            <img src={selectedWeek.thumbnail} alt={selectedText.title} />
          </figure>
        )}

        <p className="meal-prep-intro-text">{selectedText.intro}</p>
        <p className="meal-prep-sugar-note">{selectedText.sugarNote}</p>

        <section className="meal-prep-block">
          <h2>{selectedText.planTitle}</h2>
          <div className="meal-prep-meals">
            {selectedText.meals.map((meal) => (
              <div className="meal-prep-meal" key={meal.title}>
                <h3>{meal.title}</h3>
                <p className="meal-prep-meal-note">{meal.note}</p>
                <ul>
                  {meal.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="meal-prep-block">
          <h2>{selectedText.dishesTitle}</h2>
          <div className="meal-prep-dishes">
            {selectedText.dishes.map((dish) => (
              <div className="meal-prep-dish" key={dish.name}>
                <h3>{dish.name}</h3>
                <p>{dish.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="meal-prep-block">
          <h2>{selectedText.prepTitle}</h2>
          <ol className="meal-prep-steps">
            {selectedText.prep.map((step, index) => (
              <li className="meal-prep-step" key={step.title}>
                <span className="meal-prep-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="meal-prep-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="meal-prep-block">
          <h2>{selectedText.galleryTitle}</h2>
          <div className="meal-prep-photo-grid">
            {selectedWeek.photos.map((photo) => {
              const caption = photo.caption?.[lang] || photo.caption?.en || ''
              return (
                <figure className="meal-prep-photo" key={photo.src}>
                  <img src={photo.src} alt={caption} loading="lazy" decoding="async" />
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              )
            })}
          </div>
        </section>

        <section className="meal-prep-block">
          <h2>{selectedText.storageTitle}</h2>
          <ul className="meal-prep-storage">
            {selectedText.storage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="meal-prep-block">
          <h2>{selectedText.notesTitle}</h2>
          <div className="meal-prep-notes">
            {selectedText.notes.map((note) => (
              <div className="meal-prep-note" key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="meal-prep-closing">{selectedText.closing}</p>
        <button type="button" className="meal-prep-back meal-prep-back-bottom" onClick={closeWeek}>
          {ui.back}
        </button>
      </article>
    )
  } else {
    content = (
      <>
        <div className="meal-prep-heading">
          <div>
            <p className="meal-prep-eyebrow">{ui.eyebrow}</p>
            <h2>{ui.heading}</h2>
            <p className="meal-prep-subtitle">{ui.subtitle}</p>
            <p className="meal-prep-intro">{ui.intro}</p>
            <p className="meal-prep-house-rules">{ui.houseRules}</p>
          </div>
          {languageSwitch}
        </div>

        {weeks.length > 0 ? (
          <div className="meal-prep-grid">
            {weeks.map((week) => {
              const text = weekText(week, lang)
              return (
                <article
                  className="meal-prep-card"
                  key={week.slug}
                  role="button"
                  tabIndex={0}
                  aria-label={`${ui.view}: ${text.title}`}
                  onClick={() => openWeek(week.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openWeek(week.slug)
                    }
                  }}
                >
                  <div className="meal-prep-card-media">
                    {week.thumbnail ? (
                      <img src={week.thumbnail} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <div className="meal-prep-card-placeholder" aria-hidden="true">
                        {ui.kicker}
                      </div>
                    )}
                    <span className="meal-prep-card-week">{text.weekLabel}</span>
                  </div>
                  <div className="meal-prep-card-body" lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
                    <p className="meal-prep-card-kicker">{ui.kicker}</p>
                    <h3>{text.title}</h3>
                    <p className="meal-prep-card-summary">{text.summary}</p>
                    <dl className="meal-prep-card-stats">
                      {text.stats.slice(0, 3).map((stat) => (
                        <div key={stat.label}>
                          <dt>{stat.label}</dt>
                          <dd>{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className="meal-prep-card-cta">{ui.view} →</span>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="muted">{ui.empty}</p>
        )}
      </>
    )
  }

  return (
    <section id="meal-prep" className="card meal-prep-section" ref={sectionRef}>
      {content}
    </section>
  )
}
