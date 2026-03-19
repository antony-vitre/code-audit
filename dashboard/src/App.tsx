import {useReports} from '@/hooks/useReports';
import {Topbar} from '@/components/Topbar';
import {Overview} from '@/components/Overview';
import {HealthInfo} from '@/components/HealthInfo';
import {ToolsGrid} from '@/components/ToolsGrid';
import {Issues} from '@/components/Issues';
import {OverviewChart} from '@/components/charts/OverviewChart';
import {AuditTrendChart} from '@/components/charts/AuditTrendChart';
import {CategoryTrend} from '@/components/charts/CategoryTrendChart';
import {Heatmap} from '@/components/Heatmap';

const App = () => {
  const {
    hasLoaded,
    reports,
    setCurrentReportId,
    currentReportId,
    currentReport,
    setCompareReportId,
    compareReportId,
    compareReport,
  } = useReports();
  return hasLoaded && currentReport ? (
    <div className="app">
      <Topbar
        reports={reports}
        currentReportId={currentReportId}
        compareReportId={compareReportId}
        onChangeCurrent={setCurrentReportId}
        onChangeCompare={setCompareReportId}
      />
      <div className="overview-container">
        <Overview currentReport={currentReport} compareReport={compareReport} />
        <HealthInfo report={currentReport} />
      </div>
      <div className="layout">
        <div className="stack">
          <div className="panel section">
            <div className="section-head">
              <div>
                <h2>Overview by category</h2>
              </div>
            </div>

            <div className="section-body">
              <div className="chart-box">
                <OverviewChart report={currentReport} />
              </div>
            </div>
          </div>
          <div className="split-grid">
            <div className="panel section">
              <div className="section-head">
                <div>
                  <h2>Audit trend</h2>
                  <p>
                    Evolution of the health score and consolidated issue volume.
                  </p>
                </div>
              </div>

              <div className="section-body">
                <div className="chart-box-sm">
                  <AuditTrendChart reports={reports} />
                </div>
              </div>
            </div>

            <div className="panel section">
              <div className="section-head">
                <div>
                  <h2>Trend by category</h2>
                  <p>Evolution of issues by category.</p>
                </div>
              </div>
              <div className="section-body">
                <div className="chart-box-sm">
                  <CategoryTrend reports={reports} />
                </div>
              </div>
            </div>
          </div>

          <div className="panel section">
            <div className="section-head">
              <div>
                <h2>Categories</h2>
                <p>
                  Status, duration, metrics, delta vs compared run and access to
                  detailed JSON.
                </p>
              </div>
            </div>
            <div className="section-body">
              <ToolsGrid
                currentReport={currentReport}
                compareReport={compareReport}
              />
            </div>
          </div>
        </div>
        <div className="stack">
          <div className="panel section">
            <div className="section-head">
              <div>
                <h2>Issues</h2>
              </div>
            </div>
            <Issues
              currentReport={currentReport}
              compareReport={compareReport}
            />
          </div>
          <div className="panel section">
            <div className="section-head">
              <div>
                <h2>Heatmap history</h2>
                <p>
                  Simple reading of severity by tool on the latest available
                  audits.
                </p>
              </div>
            </div>

            <div className="section-body">
              <Heatmap reports={reports} />
              <div className="footer-note">
                The heatmap uses the last 5 audit data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : hasLoaded ? (
    <div>Impossible de charger les données</div>
  ) : (
    <div>Loading...</div>
  );
};

export default App;
