CREATE VIEW vw_TestEvaluation AS
SELECT 
    r.ResultID,
    b.BatchID,
    t.TestName,
    r.ResultValue,
    ms.MinValue,
    ms.MaxValue,
    CASE 
        WHEN r.ResultValue IS NULL THEN 'NO RESULT'
        WHEN ms.MinValue IS NOT NULL AND r.ResultValue < ms.MinValue THEN 'FAIL'
        WHEN ms.MaxValue IS NOT NULL AND r.ResultValue > ms.MaxValue THEN 'FAIL'
        ELSE 'PASS'
    END AS EvaluationStatus
FROM BatchTestResults r
JOIN BatchTests bt ON r.BatchTestID = bt.BatchTestID
JOIN Batches b ON bt.BatchID = b.BatchID
JOIN Tests t ON bt.TestID = t.TestID
JOIN MaterialSpecifications ms 
     ON ms.MaterialID = b.MaterialID AND ms.TestID = t.TestID;
