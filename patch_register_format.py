import sys
import re

with open("src/pages/Register.tsx", "r") as f:
    content = f.read()

# insert handlers before handleSubmit
handlers = """  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw.slice(0, 10);
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)} ${formatted.slice(5)}`;
    }
    setPhone(formatted);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setPincode(raw.slice(0, 6));
  };

  const handleSubmit"""

content = content.replace("  const handleSubmit", handlers)

# modify inputs
phone_input_old = """                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}"""

phone_input_new = """                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}"""

content = content.replace(phone_input_old, phone_input_new)

pincode_input_old = """                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}"""

pincode_input_new = """                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}"""

content = content.replace(pincode_input_old, pincode_input_new)

with open("src/pages/Register.tsx", "w") as f:
    f.write(content)

