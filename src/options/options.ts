// ============================================
// Options 页面脚本 - 设置页面
// ============================================
// 这个文件处理设置页面的交互
// 用户可以在这里配置后端 API 的地址

// 获取页面元素
const apiUrlInput = document.getElementById('api-url') as HTMLInputElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const saveMessage = document.getElementById('save-message') as HTMLDivElement;

// 页面加载时，从存储中读取已保存的 API URL
chrome.storage.sync.get('apiBaseUrl', (result) => {
  if (result.apiBaseUrl) {
    apiUrlInput.value = result.apiBaseUrl;
  } else {
    apiUrlInput.value = 'http://localhost:3000/api';
  }
});

// 点击保存按钮
saveBtn.addEventListener('click', async () => {
  const apiUrl = apiUrlInput.value.trim();
  
  if (!apiUrl) {
    showMessage('请输入 API URL', false);
    return;
  }

  // 保存到 Chrome 存储
  await chrome.storage.sync.set({ apiBaseUrl: apiUrl });
  showMessage('✓ 设置已保存', true);
});

// 显示保存消息
function showMessage(message: string, isSuccess: boolean) {
  saveMessage.textContent = message;
  saveMessage.style.display = 'block';
  saveMessage.style.background = isSuccess ? '#d4edda' : '#f8d7da';
  saveMessage.style.color = isSuccess ? '#155724' : '#721c24';
  saveMessage.style.borderColor = isSuccess ? '#c3e6cb' : '#f5c6cb';
  
  // 2秒后隐藏消息
  setTimeout(() => {
    saveMessage.style.display = 'none';
  }, 2000);
}

