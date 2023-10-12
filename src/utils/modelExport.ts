import ExtractData from '@n-models/ExtractData';
import KeywordChannelExplore from '@n-models/KeywordChannelExplore';
import KeywordLabelling from '@n-models/KeywordLabelling';
import KeywordSearchTracker from '@n-models/KeywordSearchTracker';

import XLSX from 'xlsx';

const TITLE_FONT = {size: 14, bold: true};

const HEADER_ROWS_KOC = ["koc", "posts", "followers", "total_views", 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'latest_content'];

const HEADER_ROWS = [
    {
        tab: 'extract-data',
        rows: ['post_url', 'description', 'platform', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'videos-extract-data',
        rows: ['post_url', 'description', 'platform', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'detect-voice-extract-data',
        rows: ['post_url', 'description', 'platform', 'transcript', 'match_keywords', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'videos-extract-data-detect-voice',
        rows: ['post_url', 'description', 'platform', 'transcript', 'match_keywords', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'comments-extract-data',
        rows: ['post_url', 'commenter', 'text', 'commented_at'],
    },
    {
        tab: 'extract-data-comments',
        rows: ['post_url', 'description', 'koc', 'platform', 'comments', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'keyword-explores',
        rows: ['keyword', 'post_url', 'description', 'koc', 'platform', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'channel-explores',
        rows: ['post_url', 'description', 'koc', 'platform', 'total_views', 'total_likes', 'total_comments', 'total_saves', 'total_shares', 'uploaded_time'],
    },
    {
        tab: 'shopee-keyword-search-tracker',
        rows: ['keyword', 'search_volume', 'bid_price'],
    },
    {
        tab: 'google-keyword-search-tracker',
        rows: ['keyword', 'search_volume', 'min_price', 'max_price', ''],
    },
    {
        tab: 'keyword-labellings',
        rows: ['keyword', 'confident_rate', 'similar_keywords'],
    },
    {
        tab: 'keyword-labelling',
        rows: ['keyword', 'confident_rate', 'similar_keywords'],
    },
];

const TAB_MODEL = [
    {
        tab: 'extract-data',
        model: ExtractData,
    },
    {
        tab: 'comments-extract-data',
        model: ExtractData,
    },
    {
        tab: 'videos-extract-data',
        model: ExtractData,
    },
    {
        tab: 'videos-extract-data-detect-voice',
        model: ExtractData,
    },
    {
        tab: 'keyword-explores',
        model: KeywordChannelExplore,
    },
    {
        tab: 'keyword-explore',
        model: KeywordChannelExplore,
    },
    {
        tab: 'channel-explores',
        model: KeywordChannelExplore,
    },
    {
        tab: 'channel-explore',
        model: KeywordChannelExplore,
    },
    {
        tab: 'keyword-labellings',
        model: KeywordLabelling,
    },
    {
        tab: 'keyword-labelling',
        model: KeywordLabelling,
    },
    {
        tab: 'shopee-keyword-search-tracker',
        model: KeywordSearchTracker,
    },
    {
        tab: 'google-keyword-search-tracker',
        model: KeywordSearchTracker,
    },
    {
        tab: 'keyword-search-tracker',
        model: KeywordSearchTracker,
    },
];

export function getTabModel(tab):
    typeof ExtractData
    | typeof KeywordChannelExplore
    | typeof KeywordLabelling
    | typeof KeywordSearchTracker {
    const model = TAB_MODEL.find((t) => t.tab === tab || tab.includes(t.tab))?.model;
    if (!model) {
        throw new TypeError('Tab is not available');
    }
    return model;
}

function getHeaderRows(tab, firstRow) {
    let header = HEADER_ROWS.find((r) => r.tab === tab)?.rows || getTabModel(tab).fillAbles;
    if (tab === "keyword-labellings") {
        const labels = JSON.parse(firstRow.labels);

        const properties = Object.keys(labels)

        header = [...header, ...properties];
        console.log(header)
        return header;
    }
    return header
}

// ------------------------------Export-----------------------------------
function makeUppercaseHeader(header){
    return header.map(function (string) {
        const upper = string.charAt(0).toUpperCase() + string.slice(1);
        return upper.replace("_"," ")
    })
}

function formatRows(rows,headers,tab) {
    if (tab === "keyword-labellings"){
        rows = rows.map(row=>{
            const labels = JSON.parse(row.labels);
            return {
                ...row,
                ...labels
            }
        })
    }
    return rows.map(row => headers.map(header => row[header]))
}

export async function createExcelFileByColumn(rows, tab, name) {
    const fileName = `${name}.xlsx`;

    // Extract headers from tab or use keys from the first object in rows
    const headers = tab ? getHeaderRows(tab, rows[0]) : Object.keys(rows[0]);

    // Convert rows array of objects to array of arrays
    const data = [makeUppercaseHeader(headers), ...formatRows(rows,headers,tab)];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Posts');

    const uniqueKOCData = getKOCData(rows, tab);
    if (uniqueKOCData && Object.keys(uniqueKOCData).length !== 0) {
        const uniqueKOCWs = XLSX.utils.aoa_to_sheet([HEADER_ROWS_KOC, ...uniqueKOCData.map(row => HEADER_ROWS_KOC.map(header => row[header]))]);
        XLSX.utils.book_append_sheet(wb, uniqueKOCWs, 'Unique KOC');
    }

    // Save the workbook to a file
    try {
        XLSX.writeFile(wb, fileName);
        return fileName;
    } catch (err) {
        throw new TypeError(`Error creating Excel file: ${err}`);
    }
}

function getKOCData(posts, tab) {
    const availableTab = ["channel-explores", "keyword-explores"];

    if (!availableTab.includes(tab)) {
        return [];
    }

    return parseKocData(posts)
}

export function parseKocData(rows) {
    const kocs = {};
    rows.forEach((post) => {
        const uniqueId = post.koc;
        if (!kocs[uniqueId]) {
            kocs[uniqueId] = {
                koc: uniqueId,
                posts: "",
                followers: post?.koc_follower_count,
                total_views: 0,
                total_likes: 0,
                total_comments: 0,
                total_saves: 0,
                total_shares: 0,
                latest_content: post?.uploaded_time
            }
        } else {
            kocs[uniqueId].total_views += parseInt(post?.total_views, 10);
            kocs[uniqueId].total_likes += parseInt(post?.total_likes, 10);
            kocs[uniqueId].total_comments += parseInt(post?.total_comments, 10);
            kocs[uniqueId].total_saves += parseInt(post?.total_saves, 10);
            kocs[uniqueId].total_shares += parseInt(post?.total_shares, 10);
            kocs[uniqueId].latest_content =
                kocs[uniqueId]?.latest_content < post?.uploaded_time
                    ? post?.uploaded_time
                    : kocs[uniqueId]?.latest_content;
            if (kocs[uniqueId].posts?.length < 30000) {
                kocs[uniqueId].posts += (post?.post_url + ";\n");
            } else {
                if (kocs[uniqueId].posts?.length < 30003) {
                    kocs[uniqueId].posts += "..."
                }
            }
        }
    })
    return Object.values(kocs);
}
