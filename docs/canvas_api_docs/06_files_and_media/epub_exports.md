# Epub Exports

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List courses with their latest ePub exportEpubExportsController#index


### GET /api/v1/epub_exports


A paginated list of all courses a user is actively participating in, and the latest ePub export associated with the user & course.


---

## Create ePub ExportEpubExportsController#create


### POST /api/v1/courses/:course_id/epub_exports


Begin an ePub export for a course.


You can use the Progress API to track the progress of the export. The exportâs progress is linked to with the progress_url value.


When the export completes, use the Show content export endpoint to retrieve a download URL for the exported content.


---

## Show ePub exportEpubExportsController#show


### GET /api/v1/courses/:course_id/epub_exports/:id


Get information about a single ePub export.
