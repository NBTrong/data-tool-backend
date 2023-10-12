import XLSX from 'xlsx';
import {InternalError} from "@n-errors/HttpError";
import axios from 'axios';

export function timestampToDate(unixTimestamp, format = 'all-unit') {
  const dateFormat = new Date(
    parseInt(unixTimestamp, 10) > 1000000000
      ? unixTimestamp * 1000
      : unixTimestamp,
  );
  let options;
  if (format === 'all-unit') {
    options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  }
  if (format === 'date') {
    options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  }
  return dateFormat.toLocaleDateString('en-US', options);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertDateStringToDateFormat(timeStr) {
  const year = timeStr.slice(0, 4);
  const month = timeStr.slice(4, 6);
  const day = timeStr.slice(6, 8);

  return `${year}-${month}-${day}`;
}

export async function downloadExcelFile(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    console.error('Error downloading the Excel file:', error);
    throw error;
  }
}

export function readExcelFile(data) {
  const workbook = XLSX.read(data, { type: 'array' });
  // Đọc dữ liệu từ sheet đầu tiên
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Chuyển đổi dữ liệu từ sheet sang mảng JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = jsonData.map(row=>row[0]);
  return rows;
}

export function findDifferenceArray(son, farther) {
  console.log("farther",farther)
  // Tạo một set từ array a để tối ưu việc kiểm tra tồn tại
  const setSon = new Set(son);

  // Sử dụng filter để lọc ra các phần tử không thuộc array a
  const c = farther.filter(item => !setSon.has(item));

  return c;
}