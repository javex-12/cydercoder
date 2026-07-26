import re, json
html = open("index.html", encoding="utf-8").read()
m = re.search(r"application/ld\+json\">\s*(\{.*?\})\s*</script>", html, re.S)
if not m:
    raise SystemExit("No JSON-LD found")
data = json.loads(m.group(1))
print("JSON-LD ok, nodes:", [n.get("@type") for n in data["@graph"]])
