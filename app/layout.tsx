import type { Metadata } from 'next'
import { Fraunces, Spline_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '600', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vocabulario — English Conversatorio',
  description: 'Shared vocabulary log for the B1→C1 English study group.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${splineSans.variable}`}>
      <head>
        <Script id="fetch-patch" strategy="beforeInteractive">{`
          (function(){
            function strip(v){ return String(v).replace(/[^\\x00-\\xFF]/g,''); }

            var _set = Headers.prototype.set;
            var _app = Headers.prototype.append;
            Headers.prototype.set = function(n,v){ return _set.call(this,n,strip(v)); };
            Headers.prototype.append = function(n,v){ return _app.call(this,n,strip(v)); };

            var orig = window.fetch;
            window.fetch = function(input, init) {
              if (init && init.headers) {
                var h = init.headers, clean = {}, pairs, i;
                if (typeof h.entries === 'function') {
                  pairs = [];
                  h.forEach(function(v,k){ pairs.push([k,v]); });
                } else if (Array.isArray(h)) {
                  pairs = h;
                } else {
                  pairs = Object.keys(h).map(function(k){ return [k, h[k]]; });
                }
                for (i = 0; i < pairs.length; i++) {
                  clean[pairs[i][0]] = String(pairs[i][1]).replace(/[^\\x00-\\xFF]/g,'');
                }
                init = Object.assign({}, init, { headers: clean });
              }
              return orig.apply(this, [input, init]);
            };
          })();
        `}</Script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
