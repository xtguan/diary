import React from 'react'

export default function Header(){
  return (
    <header>
      <div className="brand">Xiaotang Guan</div>
      <nav className="nav">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#blog">Blog</a>
        <a href="#bakery" title="The Corporate Captive’s Kitchen & Bakery">Bakery</a>
        <a href="#meal-prep" title="Clocked Out & Cooked Up">Meal Prep</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}
