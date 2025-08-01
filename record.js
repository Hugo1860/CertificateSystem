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
            row.innerHTML = `
                <td><input type="checkbox" class="record-checkbox" data-id="${record.id}"></td>
                <td>${index + 1}</td>
                <td>${record.name}</td>
                <td>${record.id}</td>
                <td>${record.issueDate}</td>
                <td>${record.courseName}</td>
            `;
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

    // 下载选中的记录
    async function downloadSelectedRecords() {
        try {
            const selectedCheckboxes = document.querySelectorAll('.record-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('请选择要下载的证书');
                return;
            }

            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
            const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
            const selectedRecords = allRecords.filter(record => selectedIds.includes(record.id));

            // 创建 ZIP 文件
            const zip = new JSZip();

            // 为每个选中的记录生成证书
            for (const record of selectedRecords) {
                // 使用记录信息生成证书内容
                const certificateContent = `
姓名：${record.name}
证书编号：${record.id}
课程名称：${record.courseName}
签发日期：${record.issueDate}
                `;
                
                // 添加到 ZIP 文件
                zip.file(`证书_${record.name}_${record.id}.txt`, certificateContent);
            }

            // 生成并下载 ZIP 文件
            const content = await zip.generateAsync({type: 'blob'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `证书_${new Date().getTime()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error('下载证书时出错:', error);
            alert('下载证书失败，请重试: ' + error.message);
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