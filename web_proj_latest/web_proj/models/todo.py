class IncidentReport:
    def __init__(self, title, description, status, created_at=None, updated_at=None, _id=None):
        self._id = _id
        self.title = title
        self.description = description
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @staticmethod
    def from_dict(data):
        return IncidentReport(
            title=data.get("title"),
            description=data.get("description"),
            status=data.get("status"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            _id=data.get("_id")
        )

if __name__ == "__main__":
    import sys
    import os
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from config.database import db
    collection = db["incident_reports"]
    doc = collection.find_one()
    print(doc)
