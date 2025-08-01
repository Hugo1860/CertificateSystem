document.addEventListener('DOMContentLoaded', function() {
    // 初始化证书预览区域的默认值
    const defaultValues = {
        studentName: '张三',
        certificateTitle: '课程毕业证书',
        courseName: 'AHA心肺复苏指南中文学习',
        certificateType: '完整学习了云端科教',
        certificateNumber: 'XXYY-20250010020',
        institution: 'XXX医院'
    };

    // 设置当前日期为默认日期
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    // 设置日期输入框的默认值
    document.getElementById('certificateDate').value = currentDate;

    // 更新预览区域的函数
    function updatePreview() {
        // 获取输入值，如果为空则使用默认值
        const studentNamesText = document.getElementById('studentNames').value;
        // 只获取第一个姓名
        const firstStudentName = studentNamesText.split(/[\n\r]+/)[0].trim() || defaultValues.studentName;
        
        const certificateTitle = document.getElementById('certificateTitle').value || defaultValues.certificateTitle;
        const courseName = document.getElementById('courseName').value || defaultValues.courseName;
        const courseNamePreview = document.getElementById('courseNamePreview');
        if (courseNamePreview) {
            courseNamePreview.textContent = courseName;
            // 恢复保存的字体大小
            const savedSize = localStorage.getItem('courseNamePreview_fontSize');
            if (savedSize) {
                courseNamePreview.style.fontSize = savedSize;
            }
        }
        const certificateType = document.getElementById('certificateType').value || defaultValues.certificateType;
        const certificateNumber = document.getElementById('certificateNumber').value || defaultValues.certificateNumber;
        const institution = document.getElementById('institution').value || defaultValues.institution;
        const certificateDate = document.getElementById('certificateDate').value || currentDate;

        // 修改日期格式显示
        const formattedDate = certificateDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日');

        // 更新预览区域
        document.querySelector('.student-name').textContent = firstStudentName;
        document.querySelector('.cn-title').textContent = certificateTitle;
        document.querySelector('.course-name').textContent = courseName;
        document.querySelector('.completion-text').textContent = certificateType;
        document.querySelector('.certificate-number .number').textContent = certificateNumber;
        document.querySelector('.institution .cn-text').textContent = institution;
        document.querySelector('.issue-date .date').textContent = formattedDate;
    }

    // 为所有输入框添加事件监听器
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // 生成证书按钮点击事件
    document.getElementById('generateBtn').addEventListener('click', function() {
        // 创建一个临时的包装器元素，用于复制预览区的双层边框效果
        const wrapperElement = document.createElement('div');
        wrapperElement.style.position = 'relative';
        wrapperElement.style.padding = '18px';
        wrapperElement.style.border = '10px solid ' + document.getElementById('borderColor').value;
        wrapperElement.style.backgroundColor = 'white';
        
        // 获取原始证书元素并克隆
        const certificateElement = document.querySelector('.certificate').cloneNode(true);
        
        // 直接设置证书样式，不需要保存原始样式
        certificateElement.style.border = `2px solid ${document.getElementById('borderColor').value}`;
        certificateElement.style.padding = '20px';
        
        // 将证书元素添加到包装器中
        wrapperElement.appendChild(certificateElement);
        
        // 将包装器添加到一个隐藏的容器中以便生成图片
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.width = '950px'; // 与预览区相同的宽度
        hiddenContainer.appendChild(wrapperElement);
        document.body.appendChild(hiddenContainer);

        // 获取输入值
        const studentNamesText = document.getElementById('studentNames').value;
        const certificateNumber = document.getElementById('certificateNumber').value || defaultValues.certificateNumber;

        // 确保 html2canvas 已加载
        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas 未加载');
            alert('证书生成组件未加载，请刷新页面重试');
            document.body.removeChild(hiddenContainer);
            return;
        }

        // 分割学员姓名（按换行符分割）
        const studentNames = studentNamesText.split(/[\n\r]+/).filter(name => name.trim());
        
        if (studentNames.length === 0) {
            alert('请输入至少一个学员姓名');
            document.body.removeChild(hiddenContainer);
            return;
        }

        // 为每个学员生成证书
        let processedCount = 0;
        
        async function generateCertificates() {
            const certificateDate = document.getElementById('certificateDate').value;
            const formattedDate = certificateDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日');
            const institution = document.getElementById('institution').value || 'XXX医院';
            const courseName = document.getElementById('courseName').value || defaultValues.courseName;
            const certificateType = document.getElementById('certificateType').value || defaultValues.certificateType;

            if (studentNames.length === 1) {
                const studentName = studentNames[0].trim();
                certificateElement.querySelector('.student-name').textContent = studentName;
                certificateElement.querySelector('.issue-date .date').textContent = formattedDate;
                certificateElement.querySelector('.certificate-number .number').textContent = certificateNumber;
                certificateElement.querySelector('.course-name').textContent = courseName;
                certificateElement.querySelector('.completion-text').textContent = certificateType;
                certificateElement.querySelector('.institution .cn-text').textContent = institution;

                try {
                    const canvas = await html2canvas(wrapperElement, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    });

                    const link = document.createElement('a');
                    const fileName = `${studentName}-${certificateNumber}.png`;
                    link.download = fileName;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    processedCount = 1;

                    // 保存记录
                    saveCertificateRecord(
                        studentName, 
                        certificateNumber, 
                        courseName,
                        formattedDate,
                        institution,
                        certificateType
                    );
                } catch (error) {
                    console.error(`生成证书失败:`, error);
                    alert('证书生成失败，请重试');
                }
            } else {
                const zip = new JSZip();
                const certificates = zip.folder("certificates");

                // 从证书编号中提取基础部分和数字部分
                const baseNumber = certificateNumber.replace(/\d+$/, '');
                const startNumber = parseInt(certificateNumber.match(/\d+$/)?.[0] || '0');

                for (let i = 0; i < studentNames.length; i++) {
                    const studentName = studentNames[i].trim();
                    if (!studentName) continue;

                    const newNumber = String(startNumber + i).padStart(4, '0');
                    const uniqueNumber = `${baseNumber}${newNumber}`;

                    certificateElement.querySelector('.student-name').textContent = studentName;
                    certificateElement.querySelector('.issue-date .date').textContent = formattedDate;
                    certificateElement.querySelector('.certificate-number .number').textContent = uniqueNumber;
                    certificateElement.querySelector('.course-name').textContent = courseName;
                    certificateElement.querySelector('.completion-text').textContent = certificateType;
                    certificateElement.querySelector('.institution .cn-text').textContent = institution;

                    try {
                        const canvas = await html2canvas(wrapperElement, {
                            scale: 2,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#ffffff'
                        });

                        const blob = await new Promise(resolve => {
                            canvas.toBlob(resolve, 'image/png');
                        });

                        const fileName = `${studentName}-${uniqueNumber}.png`;
                        certificates.file(fileName, blob);
                        processedCount++;

                        // 保存记录
                        saveCertificateRecord(
                            studentName,
                            uniqueNumber,
                            courseName,
                            formattedDate,
                            institution,
                            certificateType
                        );
                    } catch (error) {
                        console.error(`生成 ${studentName} 的证书失败:`, error);
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                try {
                    const content = await zip.generateAsync({type: "blob"});
                    const link = document.createElement('a');
                    link.download = `证书批量导出-${new Date().toLocaleDateString()}.zip`;
                    link.href = URL.createObjectURL(content);
                    link.click();
                    URL.revokeObjectURL(link.href);
                } catch (error) {
                    console.error('生成ZIP文件失败:', error);
                    alert('生成ZIP文件失败，请重试');
                }
            }

            // 清理临时元素
            document.body.removeChild(hiddenContainer);

            // 显示完成消息
            if (processedCount > 0) {
                const message = studentNames.length === 1 
                    ? '证书生成完成！' 
                    : `证书生成完成！\n成功生成 ${processedCount} 份证书，已打包为ZIP文件。`;
                alert(message);
            }
        }

        // 开始生成证书
        generateCertificates().catch(error => {
            console.error('证书生成过程出错:', error);
            alert('证书生成过程出错，请重试');
            // 清理临时元素
            if (document.body.contains(hiddenContainer)) {
                document.body.removeChild(hiddenContainer);
            }
        });
    });

    // 边框颜色变化时更新预览
    document.getElementById('borderColor').addEventListener('input', function(e) {
        const color = e.target.value;
        // 更新内层边框
        document.querySelector('.certificate').style.border = `2px solid ${color}`;
        // 更新外层边框
        document.querySelector('.certificate-wrapper').style.border = `10px solid ${color}`;
    });

    // 字体颜色变化时更新预览
    document.getElementById('fontColor').addEventListener('input', function(e) {
        const color = e.target.value;
        const certificate = document.querySelector('.certificate');
        
        // 更新标题颜色
        certificate.querySelector('.cn-title').style.color = color;
        
        // 更新证书名称颜色
        certificate.querySelector('.cn-title').style.color = color;
        
        // 更新课程名称颜色
        certificate.querySelector('.course-name').style.color = color;
        
        // 更新证书类型（完整学习了云端科教）颜色
        certificate.querySelector('.completion-text').style.color = color;
        
        // 更新"特授此证书"文字颜色
        certificate.querySelector('.award-text').style.color = color;
        
        // 更新学员姓名颜色
        certificate.querySelector('.student-name').style.color = color;
        
        // 更新底部文字颜色
        const footerElements = certificate.querySelectorAll('.certificate-footer span');
        footerElements.forEach(element => {
            element.style.color = color;
        });
    });

    // 初始化预览区域
    updatePreview();

    // Logo 上传和预览功能
    document.getElementById('logoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // 更新预览区域
                const logoPreview = document.getElementById('logoPreview');
                const logoPreviewContainer = document.getElementById('logoPreviewContainer');
                logoPreview.src = e.target.result;
                logoPreviewContainer.style.display = 'block';
                
                // 更新证书中的 logo
                const certificateLogo = document.querySelector('.certificate .logo img');
                certificateLogo.src = e.target.result;
                certificateLogo.style.filter = 'none'; // 移除默认的亮度过滤
            };
            reader.readAsDataURL(file);
        }
    });

    // 移除 logo 功能
    document.getElementById('removeLogo').addEventListener('click', function() {
        // 清除文件输入
        document.getElementById('logoUpload').value = '';
        
        // 隐藏预览
        document.getElementById('logoPreviewContainer').style.display = 'none';
        
        // 清除证书中的 logo
        const certificateLogo = document.querySelector('.certificate .logo img');
        certificateLogo.src = '';
    });

    // 字体大小调节功能
    document.querySelectorAll('.font-size-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const action = this.dataset.action;
            const targetElement = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
            
            if (!targetElement) return;
            
            // 获取当前字体大小
            const currentSize = parseFloat(window.getComputedStyle(targetElement).fontSize);
            
            // 根据操作调整字体大小
            if (action === 'increase') {
                targetElement.style.fontSize = `${currentSize + 2}px`;
            } else if (action === 'decrease') {
                // 设置最小字体大小为12px
                if (currentSize > 14) {
                    targetElement.style.fontSize = `${currentSize - 2}px`;
                }
            }

            // 保存字体大小设置到 localStorage
            localStorage.setItem(`${targetId}_fontSize`, targetElement.style.fontSize);
        });
    });

    // 页面加载时恢复保存的字体大小设置
    document.addEventListener('DOMContentLoaded', function() {
        const elements = ['certificateTitlePreview', 'courseNamePreview'];
        elements.forEach(id => {
            const savedSize = localStorage.getItem(`${id}_fontSize`);
            if (savedSize) {
                const element = document.getElementById(id) || document.querySelector(`.${id}`);
                if (element) {
                    element.style.fontSize = savedSize;
                }
            }
        });
    });
    // ===========================================
    // 模板切换功能
    // ===========================================
    
    // 当前选择的模板
    let currentTemplate = 'classic';
    
    // 初始化模板切换功能
    initTemplateSelector();
    
    function initTemplateSelector() {
        const templateThumbnails = document.querySelectorAll('.template-thumbnail');
        const certificatePreview = document.getElementById('certificatePreview');
        
        templateThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const templateType = this.getAttribute('data-template');
                switchTemplate(templateType);
                
                // 更新激活状态
                templateThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 保存用户选择的模板
                localStorage.setItem('selectedTemplate', templateType);
            });
        });
        
        // 恢复用户上次选择的模板
        const savedTemplate = localStorage.getItem('selectedTemplate');
        if (savedTemplate && savedTemplate !== 'classic') {
            const savedThumbnail = document.querySelector(`[data-template="${savedTemplate}"]`);
            if (savedThumbnail) {
                savedThumbnail.click();
            }
        }
    }
    
    function switchTemplate(templateType) {
        const certificate = document.getElementById('certificatePreview');
        if (!certificate) return;
        
        // 移除所有模板类
        certificate.className = certificate.className.replace(/template-\w+/g, '');
        
        // 添加新的模板类
        certificate.classList.add(`template-${templateType}`);
        
        // 更新当前模板
        currentTemplate = templateType;
        
        // 根据模板类型调整特定样式
        adjustTemplateSpecificStyles(templateType);
        
        // 重新应用用户的颜色设置
        applyColorSettings();
    }
    
    function adjustTemplateSpecificStyles(templateType) {
        const certificate = document.getElementById('certificatePreview');
        
        switch(templateType) {
            case 'modern':
                // 现代模板的特殊调整
                break;
            case 'elegant':
                // 优雅模板的特殊调整
                break;
            case 'professional':
                // 专业模板的特殊调整
                break;
            case 'minimalist':
                // 简约模板的特殊调整
                break;
            case 'classic':
            default:
                // 经典模板（默认）
                break;
        }
    }
    
    function applyColorSettings() {
        const borderColor = document.getElementById('borderColor').value;
        const fontColor = document.getElementById('fontColor').value;
        const certificate = document.getElementById('certificatePreview');
        
        if (!certificate) return;
        
        // 所有模板都使用相同的双边框样式
        certificate.style.border = `3px double ${borderColor}`;
        
        // 更新内边框颜色
        const style = document.createElement('style');
        style.textContent = `
            .template-${currentTemplate}::before {
                border-color: ${borderColor} !important;
            }
        `;
        
        // 移除之前的样式
        const existingStyle = document.querySelector('#dynamic-border-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'dynamic-border-style';
        document.head.appendChild(style);
    }
    
    // 监听颜色变化
    document.getElementById('borderColor').addEventListener('change', applyColorSettings);
    document.getElementById('fontColor').addEventListener('change', applyColorSettings);

}); 

// 在生成证书的代码中添加保存记录的函数
function saveCertificateRecord(studentName, certificateNumber, courseName, certificateDate, institution, certificateType) {
    const records = JSON.parse(localStorage.getItem('certificateRecords') || '[]');
    records.push({
        id: certificateNumber,
        name: studentName,
        courseName: courseName,
        issueDate: certificateDate,
        institution: institution,
        certificateType: certificateType,
        createTime: new Date().toISOString()
    });
    localStorage.setItem('certificateRecords', JSON.stringify(records));
} 