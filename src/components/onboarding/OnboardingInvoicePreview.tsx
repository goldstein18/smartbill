
import { Button } from "@/components/ui/button";

interface OnboardingInvoicePreviewProps {
  onComplete: () => void;
  isCompleting: boolean;
}

export const OnboardingInvoicePreview: React.FC<OnboardingInvoicePreviewProps> = ({ onComplete, isCompleting }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your first invoice preview</h2>
        <p className="text-muted-foreground">Here’s a quick glimpse of what your invoice will look like.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">SmartBill Demo Firm</h3>
            <p className="text-sm text-muted-foreground">invoices@smartbillapp.com</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Invoice</div>
            <div className="font-semibold">#0001</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Bill to</div>
            <div className="font-medium">Rivera LLC</div>
            <div className="text-sm text-muted-foreground">client@example.com</div>
          </div>
          <div className="md:text-right">
            <div className="text-sm text-muted-foreground">Issue date</div>
            <div className="font-medium">Today</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Description</th>
                <th className="text-right p-3">Hours</th>
                <th className="text-right p-3">Rate</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Drafting contract</td>
                <td className="p-3 text-right">1.50</td>
                <td className="p-3 text-right">$200</td>
                <td className="p-3 text-right">$300</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Client meeting</td>
                <td className="p-3 text-right">0.75</td>
                <td className="p-3 text-right">$200</td>
                <td className="p-3 text-right">$150</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Research</td>
                <td className="p-3 text-right">0.50</td>
                <td className="p-3 text-right">$200</td>
                <td className="p-3 text-right">$100</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td className="p-3" colSpan={3}>Subtotal</td>
                <td className="p-3 text-right font-medium">$550</td>
              </tr>
              <tr className="border-t">
                <td className="p-3" colSpan={3}>Tax</td>
                <td className="p-3 text-right">$0</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-semibold" colSpan={3}>Total</td>
                <td className="p-3 text-right font-semibold">$550</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onComplete} disabled={isCompleting}>
          {isCompleting ? "Setting things up..." : "Start Tracking & Logging Hours"}
        </Button>
      </div>
    </div>
  );
};
