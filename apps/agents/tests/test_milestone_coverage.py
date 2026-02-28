import unittest

from agents.milestone_validator import (
    ensure_requirement_coverage,
    extract_covered_requirement_ids,
    find_missing_requirement_ids,
)
from models.assignment import Milestone, Milestones, RequirementItem, Requirements


class MilestoneCoverageTests(unittest.TestCase):
    def test_extract_covered_requirement_ids(self):
        milestones = Milestones(milestones=[
            Milestone(
                order=1,
                title="Outline and sources",
                description="Draft outline and annotate sources. Covers: R1, R2",
                estimatedHours=2.0,
                deliverable="Outline doc",
            ),
            Milestone(
                order=2,
                title="Implementation",
                description="Build final artifact. Covers: R3",
                estimatedHours=3.0,
                deliverable="Submission draft",
            ),
        ])
        self.assertEqual(extract_covered_requirement_ids(milestones), {"R1", "R2", "R3"})

    def test_find_missing_requirement_ids(self):
        requirements = Requirements(requirements=[
            RequirementItem(id="R1", text="Requirement one"),
            RequirementItem(id="R2", text="Requirement two"),
            RequirementItem(id="R3", text="Requirement three"),
        ])
        milestones = Milestones(milestones=[
            Milestone(
                order=1,
                title="Only first",
                description="Do first thing. Covers: R1",
                estimatedHours=1.0,
                deliverable="Draft",
            )
        ])
        self.assertEqual(find_missing_requirement_ids(requirements, milestones), ["R2", "R3"])

    def test_ensure_requirement_coverage_adds_fallback_milestones(self):
        requirements = Requirements(requirements=[
            RequirementItem(id="R1", text="Requirement one"),
            RequirementItem(id="R2", text="Requirement two"),
        ])
        milestones = Milestones(milestones=[
            Milestone(
                order=1,
                title="First pass",
                description="Do first thing. Covers: R1",
                estimatedHours=1.0,
                deliverable="Draft",
            )
        ])
        patched = ensure_requirement_coverage(requirements, milestones)
        covered = extract_covered_requirement_ids(patched)
        self.assertIn("R1", covered)
        self.assertIn("R2", covered)
        self.assertEqual([m.order for m in patched.milestones], [1, 2])


if __name__ == "__main__":
    unittest.main()
