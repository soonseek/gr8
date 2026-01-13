import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import { Web3Provider } from './providers';

describe('App', () => {
  it('renders gr8 title', () => {
    render(
      <Web3Provider>
        <App />
      </Web3Provider>
    );
    const titleElement = screen.getByText('gr8');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders dark theme background', () => {
    const { container } = render(
      <Web3Provider>
        <App />
      </Web3Provider>
    );
    const appContainer = container.firstChild as HTMLElement;
    expect(appContainer).toHaveClass('bg-gray-900');
  });

  it('renders subtitle', () => {
    render(
      <Web3Provider>
        <App />
      </Web3Provider>
    );
    const subtitle = screen.getByText(
      'Decentralized Automated Trading Platform'
    );
    expect(subtitle).toBeInTheDocument();
  });
});
