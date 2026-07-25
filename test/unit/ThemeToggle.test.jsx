import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import ThemeToggle from '../../src/components/ThemeToggle.jsx';
import { AppProvider } from '../../src/context/AppContext.jsx';

function renderThemeToggle() {
  return render(
    <AppProvider>
      <ThemeToggle />
    </AppProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders theme toggle button with initial dark mode state', () => {
    renderThemeToggle();
    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });
    expect(button).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles theme to light mode on click and updates localStorage and document attribute', () => {
    renderThemeToggle();
    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });

    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('remitflow:theme')).toBe('"light"');
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it('toggles back to dark mode on second click', () => {
    renderThemeToggle();
    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('remitflow:theme')).toBe('"dark"');
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it('initializes with light mode when localStorage contains light', () => {
    localStorage.setItem('remitflow:theme', '"light"');
    renderThemeToggle();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });
});
