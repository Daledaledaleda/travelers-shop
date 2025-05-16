
import React, { useState } from "react";
import {
  CrossmintProvider,
  CrossmintEmbeddedCheckout
} from "@crossmint/client-sdk-react-ui";

const COLLECTION_ID = "963ecd12-05a4-45ec-8234-82b198fae077";
const API_KEY = "ck_production_5ejoH34XvGYELRyU3vCakPL83cszuXJy4VTZPLcA7CK5mTE6kKRw8E9rX2SfmtnZbCQLAzBU4qH7e4F4YHssPA8MCjsDrhZzjg8C9P2xU4K8NsrxkiF9saiafRi3cgh54twvjDauVyErAQsYy9d9Rdj4SFDoYqaJpR7w5oG3bWe4pjt7BVqf6mUCnt1aD5q9jGeV7HfvYEzeQzcFBJd67gTQ";
const webpageHeader = "Bring Park Avenue to your collection";
const MAX_QUANTITY = 15;

const NFTS = [
  {
    title: "Traveler #1",
    templateId: "7ad67f6f-1a0a-478e-a770-c252893280a2",
    imageSrc: "https://ipfs.io/ipfs/QmQGu1TxCDwPBH2q8fZRuvw1U5cyNgcfYq9uEiHYzcUmVU",
    priceLabel: "Collect this Digital Art"
  },
  {
    title: "Traveler #2",
    templateId: "99478669-81ee-459d-bab2-05e726cc1bf1",
    imageSrc: "https://ipfs.io/ipfs/QmVo2vofAWAjzoZMD6EevgqLDdDLgL5vJFWenoJrkRCuNX",
    priceLabel: "Collect this Digital Art"
  },
  {
    title: "Traveler #3",
    templateId: "a6c07732-8b7c-4634-99cc-54790b4296ad",
    imageSrc: "https://ipfs.io/ipfs/Qmb8mbxBPchQZ3aMangRNYsAQLaCHA92XLFpGUAcCDHyQU",
    priceLabel: "Collect this Digital Art"
  }
];

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const handleBuyClick = (idx: number) => {
    setQuantity(1);
    setQuantityError(null);
    setActiveIndex(idx);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;
    if (value > MAX_QUANTITY) {
      setQuantity(MAX_QUANTITY);
      setQuantityError(`Maximum allowed is ${MAX_QUANTITY}`);
    } else {
      setQuantity(Math.max(1, value));
      setQuantityError(null);
    }
  };

  return (
    <CrossmintProvider apiKey={API_KEY}>
      <div style={styles.page}>
    <h1 style={styles.title}>{webpageHeader}</h1>
        <p style={styles.subtitle}>
          Collect one of the iconic <strong>Travelers</strong> by Bruno Catalano, exhibited on Park Avenue, NYC – now available as Digital Art.
        </p>

        <div style={styles.gallery}>
          {NFTS.map((nft, idx) => (
            <div key={idx} style={styles.card}>
              <img src={nft.imageSrc} alt={nft.title} style={styles.image} />
              <h2 style={styles.cardTitle}>{nft.title}</h2>
              <button onClick={() => handleBuyClick(idx)} style={styles.button}>
                {nft.priceLabel}
              </button>
            </div>
          ))}
        </div>

        {activeIndex !== null && (
          <div style={styles.overlay} onClick={() => setActiveIndex(null)}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.closeButton}
                onClick={() => setActiveIndex(null)}
              >
                &times;
              </button>

              <div style={styles.qtyContainer}>
                <label style={{ fontWeight: 500, marginRight: 12 }}>Quantity:</label>
                <button
                  onClick={() =>
                    setQuantity((q) => {
                      const newQty = Math.max(1, q - 1);
                      setQuantityError(null);
                      return newQty;
                    })
                  }
                  style={styles.qtyButton}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={MAX_QUANTITY}
                  onChange={handleQuantityChange}
                  style={styles.qtyInput}
                />
                <button
                  onClick={() =>
                    setQuantity((q) => {
                      if (q >= MAX_QUANTITY) {
                        setQuantityError(`Maximum allowed is ${MAX_QUANTITY}`);
                        return MAX_QUANTITY;
                      } else {
                        setQuantityError(null);
                        return q + 1;
                      }
                    })
                  }
                  style={styles.qtyButton}
                  disabled={quantity >= MAX_QUANTITY}
                >
                  +
                </button>
              </div>

              {quantityError && (
                <p style={styles.errorText}>{quantityError}</p>
              )}

              <CrossmintEmbeddedCheckout
                lineItems={{
                  collectionLocator: `crossmint:${COLLECTION_ID}:${NFTS[activeIndex].templateId}`,
                  callData: {
                    quantity
                  }
                }}
                payment={{
                  crypto: { enabled: true },
                  fiat: { enabled: true }
                }}
                appearance={{
                  fonts: [
                    {
                      cssSrc:
                        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                    }
                  ],
                  variables: {
                    fontFamily: "Inter, system-ui, sans-serif",
                    colors: {
                      backgroundPrimary: "#ffffff",
                      textPrimary: "#000000",
                      accent: "#0074D9"
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </CrossmintProvider>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f9f9fb",
    padding: "40px 20px",
    fontFamily: "Inter, sans-serif",
    textAlign: "center"
  },
  title: {
    fontSize: "2.75rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#111"
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#333",
    marginBottom: "2rem",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.6
  },
  gallery: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap"
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    padding: "1.5rem",
    width: "280px",
    transition: "transform 0.2s ease",
    textAlign: "center"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "0.5rem 0 1rem"
  },
  image: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "0.75rem"
  },
  button: {
    background: "#0074D9",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)"
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "20px",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666"
  },
  qtyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    gap: "0.5rem"
  },
  qtyButton: {
    fontSize: "1.25rem",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f0f0f0",
    cursor: "pointer"
  },
  qtyInput: {
    width: "60px",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "0.25rem 0.5rem"
  },
  errorText: {
    color: "#cc0000",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  }
};

export default App;
