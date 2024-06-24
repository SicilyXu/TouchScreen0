import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import ContentDetail from '../components/ContentDetail.js';
import ContentIndex from '../components/ContentIndex.js';

const GeneralContent = () => {
    const [leftSideBar, setLeftSideBar] = useState(null); // 这里应该是 [leftSideBar, setLeftSideBar]
    const [navSideBar, setNavSideBar] = useState([]);
    const { generalData, globalId, setGlobalId } = useContext(AppContext);

    useEffect(() => {
        if (generalData && globalId) {
            setLeftSideBar(generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000").name.toUpperCase());

            let navSideBarContent = [];
            if (globalId.substring(2, 4) !== '00') {

                const temp1Data = generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000");
                navSideBarContent.push({ "name": temp1Data.name, "back_id": temp1Data.global_id });
                if (globalId.substring(4, 6) !== '00') {
                    const temp2Data = temp1Data.attributes.find(tab => tab.global_id === globalId.substring(0, 4) + "0000");
                    navSideBarContent.push({ "name": temp2Data.name, "back_id": temp2Data.global_id });
                    if (globalId.substring(6, 8) !== '00') {
                        const temp3Data = temp2Data.attributes.find(tab => tab.global_id === globalId.substring(0, 6) + "00");
                        navSideBarContent.push({ "name": temp3Data.name, "back_id": temp3Data.global_id });
                    }
                } else if (globalId.substring(6, 8) !== '00') {
                    const temp3Data = temp1Data.attributes.find(tab => tab.global_id === globalId.substring(0, 4) + "0000");
                    navSideBarContent.push({ "name": temp3Data.name, "back_id": temp3Data.global_id });
                }
                setNavSideBar(navSideBarContent);
            } else if (globalId.substring(6, 8) !== '00') {
                const temp0Data = generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000");
                navSideBarContent.push({ "name": temp0Data.name, "back_id": temp0Data.global_id });
                setNavSideBar(navSideBarContent);
            } else {
                setNavSideBar([]);
            }
        }
    }, [generalData, globalId])

    return (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {/* 左侧边栏，仅当 generalData 和 globalId 存在时显示 */}
            {generalData && globalId && navSideBar.length > 0 && (
                <div className='left-sidebar' style={{ width: '10%' }}>
                    <div style={{ paddingTop: '1rem' }}>
                        {/* 返回按钮，当 navSideBar 有内容时显示 */}
                        {navSideBar.length > 0 && (
                            <div
                                className='d-flex flex-column justify-content-center align-items-center'
                                onClick={() => setGlobalId(navSideBar[navSideBar.length - 1].back_id)}
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/main/back_icon.png`}
                                    alt="back-button"
                                    style={{ width: '50%' }}
                                />
                                <p className='bar-index-content'>BACK</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* 右侧内容区，根据 globalId 的值显示不同的组件 */}
            <div className='right-sidebar' style={{ width: navSideBar.length > 0 ? '90%' : '100%' }}>
                {globalId.substring(6, 8) !== "00" ? (
                    <ContentDetail globalId={globalId} setGlobalId={setGlobalId} />
                ) : (
                    <ContentIndex globalId={globalId} setGlobalId={setGlobalId} />
                )}
            </div>
        </div>
    );
}

export default GeneralContent;
