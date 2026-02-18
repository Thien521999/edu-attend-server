- $facet: dùng trong pipeline(aggregate) để chạy 2 pipeline song song
- $lookup: dùng trong pipeline(aggregate) để join collection
- $addFields: dùng trong pipeline(aggregate) để thêm field vào document
- $project: dùng trong pipeline(aggregate) để chọn field
- $arrayElemAt: dùng trong pipeline(aggregate) để lấy phần tử đầu tiên của array
- $count: dùng trong pipeline(aggregate) để đếm số lượng document

- Khi nào dùng find()
- Dùng khi:

✅ Truy vấn đơn giản - Chỉ cần lọc và lấy data từ 1 collection
✅ Không cần join - Không cần kết hợp data từ nhiều collections
✅ Không cần tính toán phức tạp - Chỉ cần lấy data nguyên bản
✅ Code đơn giản, dễ đọc - Khi logic không phức tạp

- Khi nào dùng aggregate()
- Dùng khi:

✅ Cần join nhiều collections - Dùng $lookup để lấy data liên quan
✅ Cần tính toán phức tạp - Đếm, tổng hợp, group by, etc.
✅ Cần transform data - Thay đổi cấu trúc, thêm/bớt fields
✅ Cần pipeline xử lý nhiều bước - Filter → Join → Transform → Group
✅ Tối ưu performance - Làm nhiều việc trong 1 query (như $facet)
