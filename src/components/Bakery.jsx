import React, { useEffect, useMemo, useRef, useState } from 'react'
import recipes from '../recipes'

const UI = {
  en: {
    eyebrow: 'Baking for the gainfully employed',
    heading: 'Corporate Slave’s Bakery',
    intro:
      'For people keeping an eye on blood sugar who still want something sweet, and would rather not spend a week’s grocery money on specialty flours. Everything here is made with Walmart Great Value basics, baked in a small batch, and kept in the fridge to eat through the week. Portions are small on purpose. So is the grocery bill. Corporate slaves and wage slaves welcome.',
    houseRules:
      'House rules: cheap ingredients, small batches, less sugar, and enough left over for Wednesday.',
    language: 'Recipe language',
    english: 'EN',
    chinese: '中文',
    view: 'View recipe',
    back: '← Corporate Slave’s Bakery',
    print: 'Print recipe',
    ingredients: 'Ingredients',
    method: 'Method',
    notes: 'Notes & tips',
    tip: 'Tip',
    kicker: 'Recipe',
    saved: 'Photos after the next bake',
    checkedHint: 'Tick ingredients off as you bake.',
    empty: 'The first recipe is on its way.',
  },
  zh: {
    eyebrow: '下班后的厨房',
    heading: '打工人的烘焙间',
    intro:
      '写给需要控糖、又想吃点甜的上班族：不想为几样烘焙原料花掉一周的菜钱，也不想一次烤一大盘。这里的东西都用沃尔玛 Great Value 这类基础食材，小份量烤好，放冰箱慢慢吃一周。份量是故意做小的，菜钱也是。打工牛马，欢迎入座。',
    houseRules: '本店规矩：食材买便宜的，一次烤小份，糖少放一点，还要留到周三。',
    language: '食谱语言',
    english: 'EN',
    chinese: '中文',
    view: '查看食谱',
    back: '← 打工人的烘焙间',
    print: '打印食谱',
    ingredients: '食材',
    method: '做法',
    notes: '小贴士',
    tip: '提示',
    kicker: '食谱',
    saved: '下次出炉补图',
    checkedHint: '烘焙时可以边做边勾。',
    empty: '第一份食谱正在路上。',
  },
}

const LANG_STORAGE_KEY = 'bakery:lang'
const INITIAL_SLUG = readSlugFromUrl()

function readSlugFromUrl() {
  if (typeof window === 'undefined') return null
  const slug = new URLSearchParams(window.location.search).get('recipe')
  return recipes.some((recipe) => recipe.slug === slug) ? slug : null
}

function readInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh') return stored
  const browser = (navigator.language || '').toLowerCase()
  return browser.startsWith('zh') ? 'zh' : 'en'
}

function formatDate(iso, lang) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function recipeText(recipe, lang) {
  return recipe.content[lang] || recipe.content.en
}

export default function Bakery() {
  const [lang, setLang] = useState(readInitialLang)
  const [selectedSlug, setSelectedSlug] = useState(INITIAL_SLUG)
  const [checked, setChecked] = useState(() => new Set())
  const sectionRef = useRef(null)

  const ui = UI[lang]
  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.slug === selectedSlug) || null,
    [selectedSlug]
  )
  const selectedText = selectedRecipe ? recipeText(selectedRecipe, lang) : null

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  useEffect(() => {
    setChecked(new Set())
  }, [selectedSlug])

  useEffect(() => {
    const syncFromUrl = () => {
      setSelectedSlug(readSlugFromUrl())
    }
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  // Deep links like /?recipe=slug#bakery should scroll to the section once rendered.
  useEffect(() => {
    if (!INITIAL_SLUG) return
    const frame = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!selectedRecipe) return
    const previousTitle = document.title
    document.title = `${recipeText(selectedRecipe, lang).title} | Corporate Slave’s Bakery | Xiaotang Guan`
    return () => {
      document.title = previousTitle
    }
  }, [selectedRecipe, lang])

  const openRecipe = (slug) => {
    setSelectedSlug(slug)
    const url = new URL(window.location.href)
    url.searchParams.set('recipe', slug)
    url.hash = '#bakery'
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const closeRecipe = () => {
    setSelectedSlug(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('recipe')
    if (!url.hash) url.hash = '#bakery'
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const toggleIngredient = (key) => {
    setChecked((previous) => {
      const next = new Set(previous)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const languageSwitch = (
    <div className="bakery-lang" role="group" aria-label={ui.language}>
      <button
        type="button"
        className={`bakery-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        {ui.english}
      </button>
      <button
        type="button"
        className={`bakery-lang-btn ${lang === 'zh' ? 'is-active' : ''}`}
        aria-pressed={lang === 'zh'}
        onClick={() => setLang('zh')}
      >
        {ui.chinese}
      </button>
    </div>
  )

  let content

  if (selectedRecipe && selectedText) {
    const recipeIndex = recipes.findIndex((recipe) => recipe.slug === selectedRecipe.slug) + 1

    content = (
      <article className="bakery-recipe" lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
        <div className="bakery-recipe-toolbar">
          <button type="button" className="bakery-back" onClick={closeRecipe}>
            {ui.back}
          </button>
          <div className="bakery-toolbar-actions">
            {languageSwitch}
            <button type="button" className="bakery-print" onClick={() => window.print()}>
              {ui.print}
            </button>
          </div>
        </div>

        <header className="bakery-recipe-header">
          <p className="bakery-eyebrow">
            {selectedText.categoryLabel} · {ui.kicker} {String(recipeIndex).padStart(2, '0')}
          </p>
          <h1 className="bakery-recipe-title">{selectedText.title}</h1>
          <p className="bakery-recipe-subtitle">{selectedText.subtitle}</p>
          <dl className="bakery-stat-grid">
            {selectedText.stats.map((stat) => (
              <div className="bakery-stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {selectedRecipe.thumbnail && (
          <figure className="bakery-hero">
            <img src={selectedRecipe.thumbnail} alt={selectedText.title} />
          </figure>
        )}

        <p className="bakery-recipe-intro">{selectedText.intro}</p>

        {selectedRecipe.photos?.length > 0 && (
          <div className="bakery-photo-grid">
            {selectedRecipe.photos.map((photo) => {
              const caption = photo.caption?.[lang] || photo.caption?.en || ''
              return (
                <figure className="bakery-photo" key={photo.src}>
                  <img src={photo.src} alt={caption} loading="lazy" />
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              )
            })}
          </div>
        )}

        <section className="bakery-block" aria-labelledby="bakery-ingredients">
          <div className="bakery-block-head">
            <h2 id="bakery-ingredients">{ui.ingredients}</h2>
            <p className="bakery-hint">{ui.checkedHint}</p>
          </div>
          <div className="bakery-ingredient-groups">
            {selectedText.ingredients.map((group, groupIndex) => (
              <div className="bakery-ingredient-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item, itemIndex) => {
                    const key = `${groupIndex}-${itemIndex}`
                    const isChecked = checked.has(key)
                    return (
                      <li key={key}>
                        <label className={`bakery-ingredient ${isChecked ? 'is-checked' : ''}`}>
                          <input
                            type="checkbox"
                            className="bakery-ingredient-check"
                            checked={isChecked}
                            onChange={() => toggleIngredient(key)}
                          />
                          <span className="bakery-ingredient-body">
                            <span className="bakery-ingredient-amount">{item.amount}</span>
                            <span className="bakery-ingredient-name">{item.name}</span>
                            {item.note && <span className="bakery-ingredient-note">{item.note}</span>}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bakery-block" aria-labelledby="bakery-method">
          <h2 id="bakery-method">{ui.method}</h2>
          <ol className="bakery-steps">
            {selectedText.steps.map((step, stepIndex) => (
              <li className="bakery-step" key={step.title}>
                <span className="bakery-step-number" aria-hidden="true">
                  {stepIndex + 1}
                </span>
                <div className="bakery-step-body">
                  <h3>{step.title}</h3>
                  {step.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {step.tip && (
                    <p className="bakery-tip">
                      <strong>{ui.tip}</strong> {step.tip}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bakery-block" aria-labelledby="bakery-notes">
          <h2 id="bakery-notes">{ui.notes}</h2>
          <div className="bakery-notes">
            {selectedText.notes.map((note) => (
              <div className="bakery-note" key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </div>
            ))}
          </div>
        </section>

        <button type="button" className="bakery-print bakery-print-bottom" onClick={() => window.print()}>
          {ui.print}
        </button>
      </article>
    )
  } else {
    content = (
      <>
        <div className="bakery-heading">
          <div className="bakery-heading-copy">
            <p className="bakery-eyebrow">{ui.eyebrow}</p>
            <h2>{ui.heading}</h2>
            <p className="bakery-intro">{ui.intro}</p>
            <p className="bakery-house-rules">{ui.houseRules}</p>
          </div>
          {languageSwitch}
        </div>

        {recipes.length ? (
          <div className="bakery-grid">
            {recipes.map((recipe, index) => {
              const text = recipeText(recipe, lang)
              return (
                <article
                  className="bakery-card"
                  key={recipe.slug}
                  role="button"
                  tabIndex={0}
                  aria-label={`${ui.view}: ${text.title}`}
                  onClick={() => openRecipe(recipe.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openRecipe(recipe.slug)
                    }
                  }}
                >
                  <div className="bakery-card-media">
                    {recipe.thumbnail ? (
                      <img src={recipe.thumbnail} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <div className="bakery-card-placeholder" aria-hidden="true">
                        {ui.saved}
                      </div>
                    )}
                    <span className="bakery-card-badge">{text.categoryLabel}</span>
                    <span className="bakery-card-number">
                      {ui.kicker} {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="bakery-card-body" lang={lang === 'zh' ? 'zh-Hans' : 'en'}>
                    <p className="bakery-card-date">{formatDate(recipe.date, lang)}</p>
                    <h3 className="bakery-card-title">{text.title}</h3>
                    <p className="bakery-card-summary">{text.summary}</p>
                    <dl className="bakery-card-stats">
                      {text.stats.slice(0, 3).map((stat) => (
                        <div key={stat.label}>
                          <dt>{stat.label}</dt>
                          <dd>{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className="bakery-card-cta">
                      {ui.view} <span aria-hidden="true">→</span>
                    </span>
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
    <section id="bakery" className="card bakery-section" ref={sectionRef}>
      {content}
    </section>
  )
}
