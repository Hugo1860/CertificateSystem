document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const selectAllCheckbox = document.getElementById('selectAll');
    const recordList = document.getElementById('recordList');
    const closeBtn = document.querySelector('.close-btn');

    // 加载记录
    function loadRecords() {
        const records = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
        displayRecords(records);
    }

    // 显示记录
    function displayRecords(records) {
        recordList.innerHTML = '';
        records.forEach((record, index) => {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'record-checkbox';
            checkbox.dataset.id = record.id;
            cell1.appendChild(checkbox);
            row.appendChild(cell1);

            const cell2 = document.createElement('td');
            cell2.textContent = index + 1;
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = record.name;
            row.appendChild(cell3);

            const cell4 = document.createElement('td');
            cell4.textContent = record.id;
            row.appendChild(cell4);

            const cell5 = document.createElement('td');
            cell5.textContent = record.issueDate;
            row.appendChild(cell5);

            const cell6 = document.createElement('td');
            cell6.textContent = record.courseName;
            row.appendChild(cell6);

            recordList.appendChild(row);
        });
    }

    // 搜索记录
    function searchRecords() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
        
        if (!searchTerm) {
            displayRecords(allRecords);
            return;
        }

        // 多字段搜索
        const filteredRecords = allRecords.filter(record => 
            record.name.toLowerCase().includes(searchTerm) ||      // 搜索姓名
            record.id.toLowerCase().includes(searchTerm) ||        // 搜索证书编号
            record.courseName.toLowerCase().includes(searchTerm)   // 搜索课程内容
        );

        displayRecords(filteredRecords);

        // 更新下载按钮状态
        downloadBtn.disabled = filteredRecords.length === 0;
    }

    // 下载选中的记录（已更新为生成图片）
    async function downloadSelectedRecords() {
        const downloadBtnOriginalText = downloadBtn.innerHTML;
        try {
            const selectedCheckboxes = document.querySelectorAll('.record-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('请选择要下载的证书记录');
                return;
            }

            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<span class="material-icons">hourglass_top</span> 处理中...';

            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
            const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
            const selectedRecords = allRecords.filter(record => selectedIds.includes(record.id));

            // 如果只选择一个，直接下载图片
            if (selectedRecords.length === 1) {
                const record = selectedRecords[0];
                const blob = await generateCertificateImage(record);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${record.name}-${record.id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                alert('证书已下载！');
            } else {
                // 如果选择多个，打包成 ZIP 下载
                const zip = new JSZip();
                const certificatesFolder = zip.folder("certificates");

                let processedCount = 0;
                for (const record of selectedRecords) {
                    try {
                        const blob = await generateCertificateImage(record);
                        const fileName = `${record.name}-${record.id}.png`;
                        certificatesFolder.file(fileName, blob);
                        processedCount++;
                    } catch (error) {
                        console.error(`生成 ${record.name} 的证书失败:`, error);
                    }
                }

                if (processedCount > 0) {
                    downloadBtn.innerHTML = '<span class="material-icons">archive</span> 打包中...';
                    const content = await zip.generateAsync({ type: "blob" });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `证书批量导出-${new Date().getTime()}.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    alert(`批量下载完成！\n成功生成 ${processedCount} 份证书。`);
                } else {
                    alert('所有选中的证书都生成失败，请重试。');
                }
            }

        } catch (error) {
            console.error('下载证书时出错:', error);
            alert('下载证书失败，请重试: ' + error.message);
        } finally {
            // 恢复按钮状态
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = downloadBtnOriginalText;
        }
    }

    // 事件监听器
    searchBtn.addEventListener('click', searchRecords);
    searchInput.addEventListener('input', searchRecords);  // 实时搜索
    searchInput.addEventListener('keyup', (e) => {         // 回车搜索
        if (e.key === 'Enter') {
            searchRecords();
        }
    });

    downloadBtn.addEventListener('click', downloadSelectedRecords);

    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.record-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });

    closeBtn.addEventListener('click', () => {
        window.location.href = 'certificate.html';
    });

    // 初始加载记录
    loadRecords();

    // 添加一些测试数据（开发时使用）
    if (!localStorage.getItem('certificateRecords')) {
        const testRecords = [
            {
                id: '2024001',
                name: '未命名',
                courseName: 'AHA心肺复苏指南中文学习',
                issueDate: '2024年11月30日',
                timestamp: Date.now()
            }
        ];
        localStorage.setItem('certificateRecords', JSON.stringify(testRecords));
        loadRecords();
    }
}); 