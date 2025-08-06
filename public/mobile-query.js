document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const courseInput = document.getElementById('courseInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultList = document.getElementById('resultList');
    const certificateContainer = document.getElementById('certificateContainer');

    // 添加加载状态样式
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        .loading {
            text-align: center;
            padding: 20px;
            color: #5F6368;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .loading-spinner {
            display: inline-block;
            width: 24px;
            height: 24px;
            border: 3px solid #1A73E8;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
            margin-bottom: 8px;
        }
        @keyframes spin {
            to {transform: rotate(360deg);}
        }
        .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            height: 36px;
            margin-top: 12px;
            background: #1A73E8;
            color: white;
            border: none;
            border-radius: 18px;
            font-size: 14px;
            cursor: pointer;
        }
        .download-btn:active {
            background: #1557B0;
        }
    `;
    document.head.appendChild(loadingStyle);

    searchBtn.addEventListener('click', searchCertificates);

    async function searchCertificates() {
        const name = nameInput.value.trim();
        const course = courseInput.value.trim();

        if (!name && !course) {
            alert('请至少输入姓名或课程名称');
            return;
        }

        // 禁用搜索按钮并显示加载状态
        searchBtn.disabled = true;
        resultList.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <div>正在查询证书记录...</div>
            </div>`;

        try {
            // 从 localStorage 获取证书记录
            const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
            
            // 按创建时间倒序排序
            allRecords.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            console.log('所有记录:', allRecords);
            
            // 过滤匹配的记录
            const results = allRecords.filter(record => {
                // 确保记录和必要的字段存在
                if (!record || typeof record !== 'object') return false;

                // 姓名匹配检查
                const nameMatch = !name || (
                    record.name && 
                    typeof record.name === 'string' && 
                    record.name.toLowerCase().includes(name.toLowerCase())
                );

                // 课程匹配检查
                const courseMatch = !course || (
                    record.courseName && 
                    typeof record.courseName === 'string' && 
                    record.courseName.toLowerCase().includes(course.toLowerCase())
                );

                return nameMatch && courseMatch;
            });

            console.log('搜索结果:', results);

            // 显示结果
            if (results.length === 0) {
                resultList.innerHTML = `
                    <div class="no-result">
                        <div style="margin-bottom: 8px;">未找到匹配的证书记录</div>
                        <div style="font-size: 12px; color: #5F6368;">请检查姓名或课程名称是否正确</div>
                    </div>`;
                return;
            }

            // 显示查询结果，添加创建时间显示
            resultList.innerHTML = '';
            results.forEach(record => {
                const createTime = new Date(record.createTime);
                const formattedTime = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}`;

                const card = document.createElement('div');
                card.className = 'certificate-card';

                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = `${record.name || '未知姓名'} 的证书`;
                card.appendChild(title);

                const courseInfo = document.createElement('div');
                courseInfo.className = 'info';
                courseInfo.innerHTML = `<strong>课程：</strong>`;
                courseInfo.append(document.createTextNode(record.courseName || '未知课程'));
                card.appendChild(courseInfo);

                const idInfo = document.createElement('div');
                idInfo.className = 'info';
                idInfo.innerHTML = `<strong>证书编号：</strong>`;
                idInfo.append(document.createTextNode(record.id || '无编号'));
                card.appendChild(idInfo);

                const dateInfo = document.createElement('div');
                dateInfo.className = 'info';
                dateInfo.innerHTML = `<strong>签发日期：</strong>`;
                dateInfo.append(document.createTextNode(record.issueDate || '未知日期'));
                card.appendChild(dateInfo);

                const institutionInfo = document.createElement('div');
                institutionInfo.className = 'info';
                institutionInfo.innerHTML = `<strong>培训机构：</strong>`;
                institutionInfo.append(document.createTextNode(record.institution || 'XXX医院'));
                card.appendChild(institutionInfo);

                const timeInfo = document.createElement('div');
                timeInfo.className = 'info';
                timeInfo.style.color = '#666';
                timeInfo.style.fontSize = '12px';
                timeInfo.textContent = `生成时间：${formattedTime}`;
                card.appendChild(timeInfo);

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'download-btn';
                downloadBtn.onclick = () => downloadCertificate(record.id);
                downloadBtn.innerHTML = `<span class="material-icons">download</span> 下载证书`;
                card.appendChild(downloadBtn);

                resultList.appendChild(card);
            });

        } catch (error) {
            console.error('查询证书时出错:', error);
            resultList.innerHTML = `
                <div class="no-result" style="color: #D93025;">
                    查询失败，请稍后重试
                </div>`;
        } finally {
            // 恢复搜索按钮状态
            searchBtn.disabled = false;
        }
    }

    // Refactored to use the shared certificate generator
    window.downloadCertificate = async function(certificateId) {
        const downloadButton = event.target;
        const originalButtonContent = downloadButton.innerHTML;

        try {
            const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
            const record = allRecords.find(r => r.id === certificateId);
            
            if (!record) {
                alert('未找到证书记录');
                return;
            }

            // Update button state to show progress
            downloadButton.disabled = true;
            downloadButton.innerHTML = `<span class="material-icons">hourglass_top</span> 生成中...`;

            // Generate the certificate image using the shared function
            const blob = await generateCertificateImage(record);

            const url = URL.createObjectURL(blob);
            const fileName = `${record.name}-${record.id}.png`;

            // Handle download for mobile devices
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // On mobile, opening the image in a new tab is a common way to let users save it
                window.open(url, '_blank');
                alert('证书已生成！\n请在新打开的页面中长按图片进行保存。');
            } else {
                // On desktop, trigger a direct download
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('证书已下载！');
            }

            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('下载证书时出错:', error);
            alert('下载证书失败，请重试: ' + error.message);
        } finally {
            // Restore button state
            downloadButton.disabled = false;
            downloadButton.innerHTML = originalButtonContent;
        }
    };
}); 