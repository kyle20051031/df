import shutil
from pathlib import Path

root = Path(__file__).resolve().parent
publish_dir = root / 'docs'

if publish_dir.exists():
    shutil.rmtree(publish_dir)
publish_dir.mkdir(parents=True, exist_ok=True)

for filename in ['index.html', 'style.css', 'script.js']:
    shutil.copy(root / filename, publish_dir / filename)

print(f'已建立 {publish_dir}，共複製 3 個檔案。')
