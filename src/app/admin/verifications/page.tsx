'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export default function VerificationsPage() {
  const { verifications, updateVerificationStatus } = useAppContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Verifications</CardTitle>
        <CardDescription>
          Review and manage pending business verification requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No verification requests yet.
                </TableCell>
              </TableRow>
            )}
            {verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell className="font-medium">
                  {verification.email}
                </TableCell>
                <TableCell>{verification.businessType}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {verification.details.join(', ')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      verification.status === 'Approved'
                        ? 'default'
                        : verification.status === 'Rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {verification.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          updateVerificationStatus(verification.id, 'Approved')
                        }
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateVerificationStatus(verification.id, 'Rejected')
                        }
                      >
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
