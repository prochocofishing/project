import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <nav class="nav-container">
        <div class="logo">
          <img src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop" alt="PROCHOCO Logo" class="logo-img">
          <span class="brand-name">PROCHOCO</span>
        </div>
        
        <div class="nav-menu" [class.active]="isMenuOpen()">
          <a href="#home" class="nav-link" (click)="scrollTo('home')">Home</a>
          <a href="#products" class="nav-link" (click)="scrollTo('products')">Products</a>
          <a href="#about" class="nav-link" (click)="scrollTo('about')">About</a>
          <a href="#contact" class="nav-link" (click)="scrollTo('contact')">Contact</a>
        </div>
        
        <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-expanded]="isMenuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid rgba(59, 130, 246, 0.2);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .brand-name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #3b82f6;
      text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #e2e8f0;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      position: relative;
    }

    .nav-link:hover {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .menu-toggle span {
      width: 25px;
      height: 2px;
      background: #e2e8f0;
      transition: all 0.3s ease;
      margin: 2px 0;
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.98);
        flex-direction: column;
        padding: 2rem;
        transform: translateY(-100vh);
        transition: transform 0.3s ease;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
      }

      .nav-menu.active {
        transform: translateY(0);
      }

      .menu-toggle {
        display: flex;
      }

      .menu-toggle span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .menu-toggle span:nth-child(2) {
        opacity: 0;
      }

      .menu-toggle span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  scrollTo(elementId: string) {
    this.isMenuOpen.set(false);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}