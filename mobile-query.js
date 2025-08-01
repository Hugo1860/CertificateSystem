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
            resultList.innerHTML = results.map(record => {
                // 格式化创建时间
                const createTime = new Date(record.createTime);
                const formattedTime = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}`;
                
                return `
                    <div class="certificate-card">
                        <div class="title">${record.name || '未知姓名'} 的证书</div>
                        <div class="info">课程：${record.courseName || '未知课程'}</div>
                        <div class="info">证书编号：${record.id || '无编号'}</div>
                        <div class="info">签发日期：${record.issueDate || '未知日期'}</div>
                        <div class="info">培训机构：${record.institution || 'XXX医院'}</div>
                        <div class="info" style="color: #666; font-size: 12px;">生成时间：${formattedTime}</div>
                        <button class="download-btn" onclick="downloadCertificate('${record.id}')">
                            <span class="material-icons">download</span>
                            下载证书
                        </button>
                    </div>
                `;
            }).join('');

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

    window.downloadCertificate = async function(certificateId) {
        try {
            const allRecords = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
            const record = allRecords.find(r => r.id === certificateId);
            
            if (!record) {
                alert('未找到证书记录');
                return;
            }

            // 显示加载提示
            alert('正在生成证书，请稍候...');

            // 创建一个临时的包装器元素
            const wrapperElement = document.createElement('div');
            wrapperElement.className = 'certificate-wrapper';
            wrapperElement.style.position = 'relative';
            wrapperElement.style.padding = '18px';
            wrapperElement.style.border = '10px solid #FF6634';
            wrapperElement.style.backgroundColor = 'white';
            wrapperElement.style.width = '950px';

            // 完全复制 certificate.html 中的证书结构和样式，使用记录中的信息
            wrapperElement.innerHTML = `
                <div class="certificate" style="
                    background-color: white;
                    border: 2px solid #FF6634;
                    padding: 20px;
                    width: 100%;
                    position: relative;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                ">
                    <div class="certificate-header" style="text-align: center; margin-bottom: 40px;">
                        <div class="logo" style="text-align: left; margin-bottom: 20px; padding-left: 20px;">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiIGZpbGw9IiM1RjYzNjgiPjxwYXRoIGQ9Ik00NzkuNzgyLTI0MHEtMTQuNzgzIDAtMjkuNTY1LTUuNXQtMjcuMjE3LTE4LjVMMjA3LTQ4MHEtMTQtMTQtMTkuNS0yOXQtNS41LTMxcTAtMTYgNS41LTMxdDE5LjUtMjlsMjE2LTIxNnExMi0xMiAyNy4yMTctMTcuNXQyOS41NjUtNS41cTE0Ljc4MyAwIDI5LjU2NSA1LjV0MjcuMjE3IDE3LjVsMjE2IDIxNnExNSAxNCAyMC41IDI5dDUuNSAzMXEwIDE2LTUuNSAzMXQtMjAuNSAyOUw1MzYuNTY1LTI2NHEtMTIuNDM1IDEzLTI3LjIxNyAxOC41dC0yOS41NjUgNS41Wm0wLTYwbDIxNi0yMTZxMy0zIDMtN3QtMy03TDQ3OS43ODItNzQ2cS0zLTMtNy0zdC03IDNMMjQ5LTUzMHEtMyAzLTMgN3QzIDdsMjE2Ljc4MiAyMTZxMyAzIDcgM3Q3LTNabTAtMjIwWiIvPjwvc3ZnPg==" alt="Logo" style="height: 40px; width: auto; display: block; filter: brightness(0.4);">
                        </div>
                        <h1 class="en-title" style="color: #FF6634; font-size: 24px; margin-bottom: 10px;">CERTIFICATE OF COURSE COMPLETION</h1>
                        <h1 class="cn-title" style="color: #FF6634; font-size: 36px; font-weight: bold; margin-bottom: 40px;">课程毕业证书</h1>
                    </div>
                    
                    <div class="certificate-content" style="text-align: center; margin: 65px 0;">
                        <div class="student-name" style="font-size: 24px; margin-bottom: 30px; position: relative; display: inline-block; color: #202124;">
                            ${record.name}
                            <div style="position: absolute; bottom: -10px; left: 0; width: 100%; height: 1px; background-color: #000;"></div>
                        </div>
                        <div class="completion-text" style="font-size: 18px; color: #DAA520; margin-bottom: 20px;">${record.certificateType}</div>
                        <div class="course-name" style="font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #202124;">${record.courseName}</div>
                        <div class="award-text" style="font-size: 18px; color: #DAA520; margin-top: 40px;">特授此证书</div>
                    </div>

                    <div class="certificate-footer" style="display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px;">
                        <div class="issue-date" style="font-size: 14px; color: #202124;">
                            <span>签发日期：</span>
                            <span class="date">${record.issueDate}</span>
                        </div>
                        <div class="certificate-number" style="font-size: 14px; color: #202124;">
                            <span>证书编号：</span>
                            <span class="number">${record.id}</span>
                        </div>
                        <div class="institution" style="text-align: right; color: #202124;">
                            <span>Institution</span>
                            <span class="cn-text">${record.institution}</span>
                        </div>
                    </div>
                </div>
            `;

            certificateContainer.innerHTML = '';
            certificateContainer.appendChild(wrapperElement);

            // 生成图片
            const canvas = await html2canvas(wrapperElement, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true
            });

            // 转换为图片并下载
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // 使用记录中的姓名和编号，不添加"证书_"前缀
                const fileName = `${record.name}-${record.id}.png`;
                link.download = fileName;
                
                // 对于移动端，我们需要特殊处理下载
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    // 在新窗口中打开图片，用户可以长按保存
                    window.open(url, '_blank');
                } else {
                    // 桌面端直接下载
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                
                URL.revokeObjectURL(url);
                alert('证书生成完成！\n移动端用户请长按图片进行保存。');
            }, 'image/png');

        } catch (error) {
            console.error('下载证书时出错:', error);
            alert('下载证书失败，请重试: ' + error.message);
        }
    };
}); 