export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
      return "success";

    case "SCHEDULED":
    case "ONGOING":
      return "info";

    case "PENDING":
      return "warning";

    case "REJECTED":
    case "CANCELLED":
      return "danger";

    default:
      return "default";
  }
}
