# What If Grades

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Update a submission's what-if score and calculate gradesWhatIfGradesApiController#update


### PUT /api/v1/submissions/:id/what_if_grades


Enter a what if score for a submission and receive the calculated grades Grade calculation is a costly operation, so this API should be used sparingly


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| student_entered_score |  | number | The score the student wants to test |


#### Example Response:


```
{
    "grades": [
        {
            "current": {
                "grade": 120.0,
                "total": 24.0,
                "possible": 20.0,
                "dropped": []
            },
            "current_groups": {
                "1": {
                    "id": 1,
                    "global_id": 10000000000001,
                    "score": 20.0,
                    "possible": 10.0,
                    "weight": 0.0,
                    "grade": 200.0,
                    "dropped": []
                },
                "3": {
                    "id": 3,
                    "global_id": 10000000000003,
                    "score": 4.0,
                    "possible": 10.0,
                    "weight": 0.0,
                    "grade": 40.0,
                    "dropped": []
                }
            },
            "final": {
                "grade": 21.82,
                "total": 24.0,
                "possible": 110.0,
                "dropped": []
            },
            "final_groups": {
                "1": {
                    "id": 1,
                    "global_id": 10000000000001,
                    "score": 20.0,
                    "possible": 100.0,
                    "weight": 0.0,
                    "grade": 20.0,
                    "dropped": []
                },
                "3": {
                    "id": 3,
                    "global_id": 10000000000003,
                    "score": 4.0,
                    "possible": 10.0,
                    "weight": 0.0,
                    "grade": 40.0,
                    "dropped": []
                }
            }
        }
    ],
    "submission": {
        "id": 166,
        "student_entered_score": 20.0
    }
}
```


---

## Reset the what-if scores for the current user for an entire course and recalculate gradesWhatIfGradesApiController#reset_for_student_course


### PUT /api/v1/courses/:course_id/what_if_grades/reset


Resets all what-if scores for a student in a course and recalculates grades.
