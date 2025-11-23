(() => {
  const stores = [];
  const storeContainers = document.querySelectorAll('button[aria-level="2"][aria-expanded="true"]');

  // 由于页面是动态加载的，我们需要等待所有区域展开并获取其下的商店信息
  // 但根据无障碍树结构，我们可以直接通过按钮展开的区域来提取信息

  // 遍历所有城市区域按钮（如"上海"、"北京"等）
  const cityButtons = document.querySelectorAll('button[aria-level="2"][aria-expanded="false"], button[aria-level="2"][aria-expanded="true"]');

  cityButtons.forEach(button => {
    const city = button.textContent.trim();
    const parent = button.closest('div') || button.parentElement;

    // 检查是否有子元素包含商店信息
    const storeList = parent.querySelector('ul') || parent.querySelector('[role="list"]');

    if (storeList) {
      const storeItems = storeList.querySelectorAll('li[role="listitem"]');
      storeItems.forEach(item => {
        const storeName = item.querySelector('a')?.textContent.trim() || '';
        const address = item.querySelector('p')?.textContent.trim() || '';
        const phone = item.querySelector('a[href^="tel:"]')?.textContent.trim() || '';
        const hours = item.querySelector('div[aria-label="营业时间"]')?.textContent.trim() || '';

        if (storeName) {
          stores.push({
            city,
            storeName,
            address,
            phone,
            hours
          });
        }
      });
    }
  });

  // 如果没有找到任何数据，尝试直接查找所有商店列表项
  if (stores.length === 0) {
    const allStoreItems = document.querySelectorAll('li[role="listitem"]');

    allStoreItems.forEach(item => {
      const link = item.querySelector('a');
      const name = link?.textContent.trim() || '';
      const address = item.querySelector('p')?.textContent.trim() || '';
      const phone = item.querySelector('a[href^="tel:"]')?.textContent.trim() || '';
      const hours = item.querySelector('div[aria-label="营业时间"]')?.textContent.trim() || '';

      // 从父级获取城市信息
      const parent = item.closest('div');
      let city = '';
      if (parent) {
        const cityButton = parent.querySelector('button[aria-level="2"]');
        city = cityButton?.textContent.trim() || '';
      }

      if (name) {
        stores.push({
          city,
          storeName: name,
          address,
          phone,
          hours
        });
      }
    });
  }

  // 输出结果
  console.log('Apple 零售店信息:', stores);
  return stores;
})();
